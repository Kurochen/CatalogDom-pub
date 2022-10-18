const { db, admin } = require('../util/admin');
const { validateProfileData, validateProfilePrivateData } = require('../util/validators')

exports.setUserPublicProfile = async (req, res) => {
    const { values, errors } = validateProfileData(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    values.changedAt = admin.firestore.FieldValue.serverTimestamp();

    try {
        const userRef = db.collection('users_public').doc(req.user.uid);
        await userRef.set(values, { merge: true })
        return res.status(200).json({
            message: 'Данные сохранены',
            user: values
        })
    } catch (e) {
        return res.status(500).json({
            error: e.code,
            message: 'setUserProfile error Kurochen'
        });
    }
}

exports.setUserPrivateProfile = async (req, res) => {
    const { values, errors } = validateProfilePrivateData(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    values.changedAt = admin.firestore.FieldValue.serverTimestamp();

    try {
        const userRef = db.collection('users_private').doc(req.user.uid);
        await userRef.set(values, { merge: true })
        return res.status(200).json({
            message: 'Данные сохранены',
            user: values
        })
    } catch (e) {
        return res.status(500).json({
            error: e.code,
            message: 'setUserPrivateProfile error Kurochen'
        });
    }
}

// exports.secretWord = async (req, res) => {
//     try {
//         const userRef = db.collection('users_private').doc(req.body.userId);
//         const user = await userRef.get();
//         if (!user.exists) {
//             return res.status(200).send({
//                 message: 'Приватные данные пользователя отсутствуют.',
//                 secretWord: false,
//                 test: req.body.userId
//             })
//         }
//         else if (!user.data().secretWord) {
//             return res.status(200).send({
//                 message: 'Секретное слово отсутствует.',
//                 secretWord: false
//             })
//         }
//         else {
//             return res.status(200).send({
//                 message: 'Секретное слово присутствует.',
//                 secretWord: true
//             })
//         }
//     } catch (error) {
//         return res.status(500).send({
//             status: error,
//             message: "Ошибка проверки секретного слова"
//         });
//     }
// }