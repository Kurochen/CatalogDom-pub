const config = require('../util/firebaseConfig')
const functions = require('firebase-functions');
const { validateAddNewHouse,
    validateEditMainAtributes,
    validateEditMaterialAtributes,
    validateEditPayAtributes,
    validateImageMeta,
    validateImageDelete,
    validateDeleteHouse
} = require('../util/validators')
const { admin, db } = require('../util/admin')
const spawn = require("child-process-promise").spawn;
const mkdirp = require('mkdirp');
const path = require("path");
const os = require("os");
const fs = require("fs");
//const { object } = require('firebase-functions/lib/providers/storage');

exports.addNewHouse = async (req, res) => {
    const { values, errors } = validateAddNewHouse(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    values.createdAt = admin.firestore.FieldValue.serverTimestamp();
    values.changedAt = admin.firestore.FieldValue.serverTimestamp();
    values.userId = req.user.uid;
    values.userEmail = req.user.email
    values.verifiedUser = true

    const userRef = db.collection('users_public').doc(req.user.uid);
    const houseRef = db.collection('houses_public').doc();

    let user
    try {
        user = await userRef.get();
    } catch (e) {
        return res.status(500).json({
            error: e,
            message: "Get data Error from bd"
        })
    }

    // Проверяем существование профиля
    if (!user.exists) {
        return res.status(401).json({ message: 'Необходимо создать профиль' })
    }
    //Проверяем проверенный ли пользователь, если нет, то кол-во проектов не больше 2
    //Ставим метку на проекты, что он не провоерен, чтобы не дать включить visible
    if (!user.data().verified) {
        values.verifiedUser = false  // meta on house
        if (user.data().numberHouses >= 2) {
            return res.status(400).json({
                message: "Максимум 2 проекта"
            })
        }
    }
    //Проверяем количество проектов
    if (!user.data().numberHouses > 30) {
        return res.status(403).json({
            error: e,
            message: "Проектов больше 30шт. Напишите модератору."
        })
    }

    //  +++++  END ADD OBJECT   ++++

    const batch = db.batch()
    try {
        batch.set(houseRef, values)
        batch.update(userRef, { numberHouses: admin.firestore.FieldValue.increment(1) })
        await batch.commit()
        return res.status(201).send({
            message: 'Объект добавлен',
        })
    } catch (e) {
        return res.status(500).send({
            error: e,
            message: "Ошибка при добавлении"
        });
    }
}

exports.editMainAtributes = async (req, res) => {
    const { values, errors } = validateEditMainAtributes(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });
    console.log("test")

    values.changedAt = admin.firestore.Timestamp.now();

    const houseRef = db.collection('houses_public').doc(values.houseId);

    if (values.material !== undefined) {
        console.log('if undefining s true')
        let temp = values.material;
        values.material = { name: temp }
    }

    try {
        const house = await houseRef.get()
        if (!house.exists) {
            return res.status(404).json({ message: 'Объект не найден' })
        } else if (house.data().userId !== req.user.uid) {
            return res.status(401).json({ message: 'Ошибка разрешений' })
        } else {
            await houseRef.update(values)
        }
        // Мошенническая попытка включть видимость непровернного дома
        if (values.visible === true) {
            if (house.data().verifiedHouse === false) {
                values.visible = false
            }
        }

        return res.status(201).send({
            message: 'Объект обновлен',
            house: values,
            houseId: house.id
        })
    } catch (error) {
        console.log("error Kurochen", error)
        return res.status(500).send({
            status: error,
            message: "Ошибка при обновлении"
        });
    }
}

exports.editMaterialAtributes = async (req, res) => {
    const { values, errors } = validateEditMaterialAtributes(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    req.body.changedAt = admin.firestore.Timestamp.now();
    values.name = null // undefined awoid

    try {
        delete values.houseId
        const houseRef = db.collection('houses_public').doc(req.body.houseId);
        const house = await houseRef.get()
        if (!house.exists) {
            return res.status(404).json({ message: 'Объект не найден' })
        } else if (house.data().userId !== req.user.uid) {
            return res.status(401).json({ message: 'Ошибка разрешений' })
        } else {
            values.name = house.data().material.name  //Чтобы Update не затер Name
            await houseRef.update({
                changedAt: req.body.changedAt,
                material: values
            })
        }

        return res.status(201).send({
            message: 'Объект обновлен',
            house: values,
            houseId: house.id,
            changedAt: req.body.changedAt
        })
    } catch (error) {
        console.log("error Kurochen", error)
        return res.status(500).send({
            status: error,
            message: "Ошибка при обновлении"
        });
    }
}

exports.editPayAtributes = async (req, res) => {
    const { values, errors } = validateEditPayAtributes(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    req.body.changedAt = admin.firestore.Timestamp.now();

    try {
        //удаляем из объекта values техническую информацию
        const item = values.item;
        const houseId = values.houseId;
        delete values.item;
        delete values.houseId;

        const houseRef = db.collection('houses_public').doc(houseId);
        const housePrivateRef = db.collection('houses_private').doc(houseId);
        const house = await houseRef.get()

        if (!house.exists) {
            return res.status(404).json({ message: 'Объект не найден' })
        } else if (house.data().userId !== req.user.uid) {
            return res.status(401).json({ message: 'Ошибка разрешений' })
        }
        //Пэй атрибут состоит из двух документов приватный и публичный. 
        //Проверяем есть ли приватное поле (оно всего одно).
        if (values.link === undefined) {
            await houseRef.set({
                changedAt: req.body.changedAt,
                pays: { [item]: values }
            }, { merge: true });

            return res.status(200).send({
                message: 'Данные обновлены',
                pay: values,
                changedAt: req.body.changedAt,
                item: item
            });
        } else {
            const batch = db.batch();
            let onlyPrivateLink = values.link
            delete values.link
            // Пустой объект затирает данные, а не обновляет, поэтому проверяем
            if (Object.keys(values).length !== 0) {
                console.log('Object.keys !== 1', Object.keys(values).length)
                batch.set(houseRef, {
                    changedAt: req.body.changedAt,
                    pays: { [item]: values }
                }, { merge: true })
            }

            batch.set(housePrivateRef, {
                pays: { [item]: { link: onlyPrivateLink } }
            }, { merge: true })

            await batch.commit();

            values.link = onlyPrivateLink

            return res.status(200).send({
                message: 'Данные обновлены',
                pay: values,
                changedAt: req.body.changedAt,
                item: req.body.item
            })
        }
    } catch (error) {
        console.log("error Kurochen", error)
        return res.status(500).send({
            status: error,
            message: "Ошибка при обновлении"
        });
    }
}

exports.imageDelete = async (req, res) => {
    const { values, errors } = validateImageDelete(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    req.body.changedAt = admin.firestore.Timestamp.now();
    const bucket = admin.storage().bucket();
    const fileDirDel = `${req.user.uid}/${values.houseId}/${values.item}`
    const FieldValue = admin.firestore.FieldValue;

    try {
        const houseRef = db.collection('houses_public').doc(values.houseId);
        const house = await houseRef.get()
        if (!house.exists) {
            return res.status(404).json({ message: 'Объект не найден' })
        } else if (house.data().userId !== req.user.uid) {
            return res.status(401).json({ message: 'Ошибка разрешений' })
        } else {
            await Promise.all([
                houseRef.update({ [`images.${values.item}`]: FieldValue.delete() }),
                bucket.deleteFiles({ prefix: fileDirDel })
            ])
        }

        return res.status(201).send({
            message: 'Объект удален',
            item: values.item,
            changedAt: req.body.changedAt
        })
    } catch (error) {
        console.log("error Kurochen", error)
        return res.status(500).send({
            status: error,
            message: "Ошибка при удалении"
        });
    }
}

//TODO push to massive delete house 

exports.deleteHouse = async (req, res) => {
    const { values, errors } = validateDeleteHouse(req.body);
    const valid = Object.keys(errors).length === 0 ? true : false
    if (!valid) return res.status(400).json({
        message: "Неверные данные",
        error: errors
    });

    const bucket = admin.storage().bucket();
    const fileDirDel = `${req.user.uid}/${values.houseId}`
    const houseRef = db.collection('houses_public').doc(values.houseId);
    const houseRefPrivate = db.collection('houses_private').doc(values.houseId);
    const userRef = db.collection("users_public").doc(req.user.uid)

    try {
        const house = await houseRef.get()
        if (!house.exists) {
            return res.status(404).json({ message: 'Объект не найден' })
        } else if (house.data().userId !== req.user.uid) {
            return res.status(401).json({ message: 'Ошибка разрешений' })
        } else {
            await Promise.all([
                houseRef.delete(),
                houseRefPrivate.delete(),
                bucket.deleteFiles({ prefix: fileDirDel }),
                userRef.update({ numberHouses: admin.firestore.FieldValue.increment(-1) })
            ])
        }

        return res.status(201).send({
            message: 'Объект удален',
        })
    } catch (error) {
        console.log("error Kurochen", error)
        return res.status(500).send({
            status: error,
            message: "Ошибка при удалении"
        });
    }
}


exports.uploadImage = (req, res) => {
    const BusBoy = require("busboy");

    const busboy = new BusBoy({
        headers: req.headers,
        limits: { fileSize: 3e+6, files: 1, fields: 3 }  //todo change 4
    });
    let uploadData = {};
    const formDataObj = {};

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
        if (mimetype !== "image/jpeg" && mimetype !== "image/jpg" && mimetype !== "image/png") {
            return res.status(400).json({ error: "Wrong file type submitted" });
        }
        const filepath = path.join(os.tmpdir(), filename);
        uploadData = { file: filepath, type: mimetype, name: filename };
        file.pipe(fs.createWriteStream(filepath))
    });

    busboy.on('field', (fieldname, val) => {
        formDataObj[fieldname] = val
    });

    busboy.on("finish", () => {
        console.log('formDataObj =>', formDataObj)
        const { values, errors } = validateImageMeta(formDataObj);
        const valid = Object.keys(errors).length === 0 ? true : false
        if (!valid) return res.status(400).json({
            message: "Неверные данные",
            error: errors,
            errorData: formDataObj
        });

        admin
            .storage()
            .bucket(`staging.${config.storageBucket}`)
            .upload(uploadData.file, {
                resumable: false,
                destination: `${req.user.uid}/${values.houseId}/${values.item}/${uploadData.name}`,
                metadata: {
                    metadata: {
                        contentType: uploadData.type,
                        item: values.item,
                        title: values.title,
                        houseId: values.houseId,
                        userId: req.user.uid
                    }
                }
            })
            .then(() => {
                return res.status(200).json({
                    message: 'Файл загружен',
                    item: values.item,
                    title: values.title
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    })
    busboy.end(req.rawBody);
}
const runtimeOpts = {
    timeoutSeconds: 30,
    memory: "256MB",
};

exports.generateThubnail = functions
    .region('europe-west2')
    .runWith(runtimeOpts)
    .storage
    .bucket(`staging.${config.storageBucket}`)
    .object()
    .onFinalize(async (object) => {

        const { uuid } = require('uuidv4');
        const generatedToken = uuid();

        const THUMB_MAX_HEIGHT = 320;
        const THUMB_MAX_WIDTH = 320;
        const BIG_MAX_HEIGHT = 1680;
        const BIG_MAX_WIDTH = 1680;
        const THUMB_PREFIX = 'thumb_';
        const BIG_PREFIX = 'big_';

        const filePath = object.name; // temp/Фото0047.jpg
        const contentType = object.contentType;

        const fileDir = path.dirname(filePath); // temp  //temp/userId/houseId
        const fileName = path.basename(filePath); // Фото0047.jpg
        const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`)); // temp/thumb_Фото0047.jpg
        const bigFilePath = path.normalize(path.join(fileDir, `${BIG_PREFIX}${fileName}`));
        const tempLocalFile = path.join(os.tmpdir(), filePath); // /tmp/temp/Фото0047.jpg
        const tempLocalDir = path.dirname(tempLocalFile); // /tmp/temp
        const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
        const tempLocalBigFile = path.join(os.tmpdir(), bigFilePath);

        //Exit if this is triggered on a file that is not an image.
        if (!contentType.startsWith('image/')) {
            return console.log('This is not an image.');
        }

        // Exit if the image is already a thumbnail.
        // if (fileName.startsWith(THUMB_PREFIX) || fileName.startsWith(BIG_PREFIX)) {
        //     return console.log('Already a Thumbnail or Kur.');
        // }

        // Cloud Storage files.
        const bucketStaging = admin.storage().bucket(object.bucket);
        const fileStaging = bucketStaging.file(filePath)
        const bucket = admin.storage().bucket();
        const thumbFile = bucket.file(thumbFilePath);
        const bigFile = bucket.file(bigFilePath)
        const metadata = {
            metadata: {
                contentType: contentType,
                //item: object.metadata.item,
                //userId: object.metadata.userId,
                //houseId: object.metadata.houseId,
                //testMeta: 'testMeta',
                firebaseStorageDownloadTokens: generatedToken,
                'Cache-Control': 'public,max-age=3600',
            }

            // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
            // 'Cache-Control': 'public,max-age=3600',
        };
        // Create the temp directory where the storage file will be downloaded.
        await mkdirp(tempLocalDir)
        // Download file from bucket.
        await fileStaging.download({ destination: tempLocalFile });
        console.log('The file has been downloaded to', tempLocalFile)
        // Generate a big using ImageMagick.
        await spawn('convert', ['-auto-orient', tempLocalFile, '-resize', `${BIG_MAX_WIDTH}x${BIG_MAX_HEIGHT}>`, tempLocalBigFile], { capture: ['stdout', 'stderr'] });
        console.log('Bigbnail created at', tempLocalBigFile);
        // Generate a thumbnail using ImageMagick.
        await spawn('convert', ['-auto-orient', tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile], { capture: ['stdout', 'stderr'] });
        console.log('Thumbnail created at', tempLocalThumbFile);
        // Delete files.
        await bucketStaging.deleteFiles({ prefix: fileDir })
        console.log('Delete files at', fileDir);
        // Delete previous files if ixists
        await bucket.deleteFiles({ prefix: fileDir })

        // Uploading the Files.
        await Promise.all([
            await bucket.upload(tempLocalBigFile, { destination: bigFilePath, metadata: metadata }),
            await bucket.upload(tempLocalThumbFile, { destination: thumbFilePath, metadata: metadata })
        ])
        console.log('Thumbnail and bigFile uploaded to Storage at', thumbFilePath, bigFilePath);  //F62oUfJ9YVZuX9rKwSYVUcdu8gl1/L08KcRSIozEXatinyWfK/6/thumb_Евгений Петров дом - Лист - 5 - Разрез.jpg F62oUfJ9YVZuX9rKwSYVUcdu8gl1/L08KcRSIozEXatinyWfK/6/big_Евгений Петров дом - Лист - 5 - Разрез.jpg
        // Once the image has been uploaded delete the local files to free up disk space.
        fs.unlinkSync(tempLocalFile);
        fs.unlinkSync(tempLocalThumbFile);
        fs.unlinkSync(tempLocalBigFile);


        // Get the Signed URLs for the thumbnail and original image.

        const thumbFileName = encodeURIComponent(thumbFilePath)
        const bigFileName = encodeURIComponent(bigFilePath)

        const thumbFileUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${thumbFileName}?alt=media`;
        const bigFileUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${bigFileName}?alt=media`;

        console.log(`thumbFileUrl-->${thumbFileUrl},
        bigFileUrl-->${bigFileUrl}`)

        const houseRef = db.collection('houses_public').doc(object.metadata.houseId);
        const item = object.metadata.item
        await houseRef.update({
            changedAt: admin.firestore.Timestamp.now(),
            [`images.${item}.title`]: object.metadata.title,
            [`images.${item}.urlSmall`]: thumbFileUrl,
            [`images.${item}.urlBig`]: bigFileUrl,
            [`images.${item}.token`]: generatedToken,
        })
        // await houseRef.update({
        //     changedAt: admin.firestore.Timestamp.now(),
        //     images: {
        //         [object.metadata.item]: {
        //             title: object.metadata.title,
        //             urlSmall: thumbFileUrl,
        //             urlBig: bigFileUrl,
        //         }
        //     }
        // })

    })
