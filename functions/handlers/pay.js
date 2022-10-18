const { db, admin } = require('../util/admin');
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
const { validateCreateBillQiwiPay,
    validateCheckBillQiwiPay,
    validateDeleteBillQiwiPay
} = require('../util/validators');


//=================================//

exports.checkBillQiwiPay = async (req, res) => {
    const { values, errors } = validateCheckBillQiwiPay(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    //Входные данные
    //values.billId
    //values.sellerId

    console.log("billId =>", values.billId, "sellerId=>", values.sellerId)

    //Добираемся до секретного ключа продавца
    //Строго говоря здесь ошибок быть не должно

    let sellerPrivate
    try {
        const userRef = db.collection('users_private').doc(values.sellerId);
        sellerPrivate = await userRef.get();
        if (!sellerPrivate.exists) {
            return res.status(400).send({
                message: 'Приватные данные продавца отсутствуют.',
            })
        }
        if (!sellerPrivate.data().secretKeyQiwi) {
            return res.status(400).send({
                message: 'Секретный ключ продавца отсутствует.',
            })
        }
    } catch (e) {
        return res.status(500).json({
            error: e.code,
            message: 'Private data error Kurochen'
        });
    }


    let qiwiData  //Осторожно qiwiData не включает в себя ChangedAt, uid и т.д.
    const SECRET_KEY = sellerPrivate.data().secretKeyQiwi;
    const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);
    try {
        qiwiData = await qiwiApi.getBillInfo(values.billId)
    } catch (e) {
        return res.status(500).json({
            error: e,
            message: 'Ошибка получения биллинг документа от КИВИ'
        });
    }

    if (qiwiData.customFields.userId !== req.user.uid) {
        return res.status(400).json({
            message: 'ID не совпадают',
            data: [qiwiData.userId, req.user.uid]
        })
    }

    let resData = {
        userId: req.user.uid,
        //createdAt: admin.firestore.FieldValue.serverTimestamp(),
        changedAt: admin.firestore.Timestamp.now(),
        qiwiData: qiwiData
    }

    const userBillRef = db.collection('pays_bill').doc(qiwiData.billId)
    const housePrivateRef = db.collection('houses_private').doc(qiwiData.customFields.houseId)
    const houseRef = db.collection('houses_public').doc(qiwiData.customFields.houseId)
    const sellerRef = db.collection('users_public').doc(values.sellerId)


    if (qiwiData.status.value !== 'PAID') {
        resData.qiwiData.customFields.linkProjectSnapshot = '', //Del link !
            await userBillRef.set(resData)
        return res.status(200).send({
            resData: resData,
            message: 'Платеж еще не поступил'
        })
    }

    //PAID//PAID//PAID//PAID//PAID//PAID//PAID//PAID//PAID//PAID//PAID//PAID

    const item = qiwiData.customFields.payId
    if (qiwiData.status.value === "PAID") {

        const results = await Promise.all([
            housePrivateRef.get(),
            houseRef.get(),
            sellerRef.get(),
            userBillRef.get(),
        ])
        const housePrivateDoc = results[0]
        const houseDoc = results[1]
        const seller = results[2]
        const userBill = results[3]

        //Проверяем, проверялся ли уже успешно документ bill, чтобы не получить новую ссылку
        if (userBill.data().changedSellerAccountMoney === true) {
            return res.status(400).send({
                message: 'Платеж уже проверялся'
            })
        }


        //Проверяем, поменялось ли название ссылки к проекту
        let text
        if (houseDoc.data().pays[item].title === qiwiData.customFields.payIdName) {
            resData.qiwiData.customFields.linkProject = housePrivateDoc.data().pays[item].link
            text = 'Платеж прошел'
        } else {
            resData.qiwiData.customFields.linkProject = qiwiData.customFields.linkProjectSnapshot
            text = "Платеж прошел. Ссылка на проект старой версии."
        }
        //Обновляем счет продавца
        //Если нет счета, создем его. Факт проверки в первый раз - присутствует.
        //Далее проверяем метку на чеке в БД. Если нет, то проверка в первый раз
        let accountMoney
        if (seller.data().accountMoney === undefined) {
            accountMoney = -qiwiData.amount.value   // Создаем первый счет продавца = минус стоимость проданного проекта
            console.log("accountMoney =>", accountMoney, "qiwiData.amount.value =>", qiwiData.amount.value)
        } else if (userBill.data().changedSellerAccountMoney !== true) {
            accountMoney = seller.data().accountMoney - qiwiData.amount.value
            console.log("else if accountMoney =>", accountMoney, "qiwiData.amount.value =>", qiwiData.amount.value)
        }

        console.log("itogo accountMoney =>", accountMoney, "qiwiData.amount.value =>", qiwiData.amount.value)
        resData.changedSellerAccountMoney = true  //учли покупку у продавца

        await Promise.all([
            userBillRef.set(resData),
            sellerRef.update({ accountMoney: accountMoney }),
        ]).catch(err => {
            return res.status(500).json({
                error: err,
                message: 'Ошибка обновления в БД'
            })
        })


        return res.status(200).send({
            resData: resData,
            message: text
        })
    }
}

//=========================================================================//

exports.deleteBillQiwiPay = async (req, res) => {

    //values.billId
    //console.log('deleteBiil req=>', req.body)

    const { values, errors } = validateDeleteBillQiwiPay(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    })

    const billRef = db.collection('pays_bill').doc(values.billId)
    const billDoc = await billRef.get()
    //console.log(billDoc.data())

    if (billDoc.data().qiwiData.customFields.userId !== req.user.uid) {
        return res.status(400).json({
            message: 'ID не совпадают'
        })
    }

    await billRef.delete()
    return res.status(200).json({
        message: 'Данные удалены'
    })

}

//===========================================================================================================================//

exports.createBillQiwiPay = async (req, res) => {
    const { values, errors } = validateCreateBillQiwiPay(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    //values.sellerId
    //values.houseId
    //values.payId
    //values.userName
    //values.userPhone

    //Get all data from bd

    let houseDoc
    let housePrivateDoc
    let sellerPrivateDoc
    let allUserBillCollection

    console.log('values=>', values)

    const houseRef = db.collection('houses_public').doc(values.houseId)
    const housePrivateRef = db.collection('houses_private').doc(values.houseId);
    const sellerPrivateRef = db.collection('users_private').doc(values.sellerId);
    const allUserBillRef = db.collection('pays_bill');

    try {
        const results = await Promise.all([
            houseRef.get(),
            housePrivateRef.get(),
            sellerPrivateRef.get(),
            allUserBillRef.where('userId', '==', req.user.uid).limit(10).get()
        ])
        houseDoc = results[0]
        housePrivateDoc = results[1]
        sellerPrivateDoc = results[2]
        allUserBillCollection = results[3]
    } catch (e) {
        return res.status(500).json({
            error: e,
            message: "Get data Error from bd"
        })
    }

    //Проверяем верифицирован ли дом от верифицированного юзера

    if (!houseDoc.data().verifiedUser) {
        return res.status(400).send({
            message: 'Доп не модерирован',
        })
    }


    //Check housePrivateDoc

    if (!housePrivateDoc.exists) {
        return res.status(400).send({
            message: 'Документ для дома отсутствует',
        })
    }
    if (!housePrivateDoc.data().pays[values.payId]) {
        return res.status(400).send({
            message: 'Ссылка на проект продавца отсутствует.',
        })
    }
    if (!housePrivateDoc.data().pays[values.payId].link) {
        return res.status(400).send({
            message: 'Ссылка на проект продавца отсутствует.',
        })
    }

    //Check sellerPrivateDoc

    if (!sellerPrivateDoc.exists) {
        return res.status(400).send({
            message: 'Данные профиля продавца отсутствуют',
        })
    }
    if (!sellerPrivateDoc.data().secretKeyQiwi) {
        return res.status(400).send({
            message: 'Секретный ключ продавца отсутствует.',
        })
    }

    // Check biiling count of user

    if (allUserBillCollection.size > 8) {
        return res.status(204).send({
            message: 'Оплатите или удалите уже выставленные счета',
            longMessage: true
        })
    }

    //Check Pay's atribut hucking
    if (!houseDoc.data().pays[values.payId].visible) {
        return res.status(400).send({
            message: 'Платежная форма отключена.',
        })
    }

    if (!houseDoc.data().pays[values.payId].price) {
        return res.status(400).send({
            message: 'Нет цены',
        })
    }

    const SECRET_KEY = sellerPrivateDoc.data().secretKeyQiwi;
    const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);
    const billId = qiwiApi.generateId();
    const lifetime = qiwiApi.getLifetimeByDay(3);

    const price = houseDoc.data().pays[values.payId].price
    const title = houseDoc.data().pays[values.payId].title

    const fields = {
        amount: price,
        currency: 'RUB',
        comment: title,
        //phone: customerPrivateDoc.data().phone,
        //account: houseDoc.data().userId,
        //email: houseDoc.data().userEmail,
        expirationDateTime: lifetime,
        customFields: {
            sellerPhone: sellerPrivateDoc.data().phone,
            sellerId: houseDoc.data().userId,
            sellerEmail: houseDoc.data().userEmail,
            houseId: values.houseId,
            houseIdName: houseDoc.data().name,
            payId: values.payId,
            payIdName: title,
            userId: req.user.uid,
            userName: values.userName,
            userPhone: values.userPhone,
            linkProjectSnapshot: housePrivateDoc.data().pays[values.payId].link
        },
        successUrl: 'https://catalogdom.web.app/profile/purchases'
    };

    //Запрос в Киви

    let qiwiData
    try {
        qiwiData = await qiwiApi.createBill(billId, fields)

    } catch (e) {
        return res.status(500).json({
            error: e,
            message: 'qiwiData error Kurochen'
        });
    }

    //Delete link from not paid bill
    qiwiData.customFields.linkProjectSnapshot = ''
    qiwiData.customFields.sellerPhone = ''


    //Response data

    const resData = {
        userId: req.user.uid, //для поиска документа по юзеру
        changedAt: admin.firestore.FieldValue.serverTimestamp(),
        qiwiData: qiwiData
    }

    const userBillRef = db.collection('pays_bill').doc(qiwiData.billId)
    await userBillRef.set(resData)

    return res.status(200).send({
        payUrl: qiwiData.payUrl
    })

}
