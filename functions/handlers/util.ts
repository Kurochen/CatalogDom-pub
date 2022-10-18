const mkdirp = require('mkdirp');
const path = require("path");
const os = require("os");
var fs = require("fs");
const { admin, db } = require('../util/admin')
const convert = require("xml-js");
const util = require("util");
import { Request, Response, NextFunction } from 'express';
import { HousePublicType } from '../util/types';


exports.pageNotFound = async (req: Request, res: Response) => {
    res.set("Cache-Control", "public, max-age=31536000")
    res.status(404).sendFile("404.html", { root: __dirname })
}

exports.turboYML = async (req: Request, res: Response) => {
    res.contentType('application/xml')

    const filePath = "utils/turboYML.xml";

    //Cloud storage files
    const bucket = admin.storage().bucket()
    const fileYML = bucket.file(filePath)

    fileYML.createReadStream().pipe(res)


}

const housesParse = (data: HousePublicType): object | false => {

    let offer: { [key: string]: any } | false

    const arrRequired = [
        data.userEmail,
        data.name,
        data.visible,
        data.pays?.[1]?.price,
        data.images?.[1]?.urlBig,
    ]


    const checkArr = arrRequired.findIndex(item => (item == false || item == undefined))
    if (checkArr > -1) {
        offer = false
        return offer
    }

    //Check puctures block
    if (data.images === undefined) {
        offer = false
        return
    }
    const imgArr = Object.values(data.images!)
    if (imgArr.length < 4) {
        offer = false
        return
    }

    offer = {
        type: "element",
        name: "offer",
        attributes: {
            id: data.houseId
        },
        elements: [
            {
                type: "element",
                name: "name",
                elements: [{ type: 'text', text: data.name }]
            },
            {
                type: 'element',
                name: 'url',
                elements: [{ type: 'text', text: `https://catalogdom.web.app/viewhouse/${data.houseId}` }]
            },
            {
                type: "element",
                name: "downloadable",
                elements: [
                    {
                        type: "text",
                        text: "true"
                    }
                ]
            },
            {
                type: 'element',
                name: 'currencyId',
                elements: [{ type: 'text', text: 'RUR' }]
            },
            {
                type: 'element',
                name: 'categoryId',
                elements: [{ type: 'text', text: 1 }]
            },
            {
                type: 'element',
                name: 'price',
                elements: [{ type: 'text', text: data.pays[1].price }]
            },
        ]
    }

    // @ts-ignore
    imgArr.forEach(item => (offer.elements.push(
        {
            type: 'element',
            name: 'picture',
            elements: [{ type: 'text', text: item.urlBig }]
        }
    )))

    //Description block
    if (data.description) {
        offer.elements.push(
            {
                type: 'element',
                name: 'description',
                elements: [{ type: 'text', text: data.description }]
            }
        )
    }

    //Material block
    if (data.material?.name) {
        let materialType
        let regexp = /woodType|concreteType|blockType/
        if (data.material) {
            Object.keys(data.material).forEach(key => {
                if (regexp.test(key)) {
                    materialType = data.material[key]
                } else {
                    materialType = data.material.name
                }
            });
        }
        offer.elements.push(
            {
                type: "element",
                name: "param",
                attributes: {
                    name: "Материал"
                },
                elements: [
                    {
                        type: "text",
                        text: materialType
                    }
                ]
            }
        )
    }

    //Area block
    if (data.area) {
        offer.elements.push(
            {
                type: "element",
                name: "param",
                attributes: {
                    name: "Площадь",
                    unit: "м2"
                },
                elements: [
                    {
                        type: "text",
                        text: data.area
                    }
                ]
            }
        )
    }

    //Floors block
    if (data.floors) {
        offer.elements.push(
            {
                type: "element",
                name: "param",
                attributes: {
                    name: "Этажность",
                },
                elements: [
                    {
                        type: "text",
                        text: data.floors
                    }
                ]
            }
        )
    }

    //Width block
    if (data.width) {
        offer.elements.push(
            {
                type: "element",
                name: "param",
                attributes: {
                    name: "Ширина",
                    unit: "м"
                },
                elements: [
                    {
                        type: "text",
                        text: data.width
                    }
                ]
            }
        )
    }

    //Length block
    if (data.length) {
        offer.elements.push(
            {
                type: "element",
                name: "param",
                attributes: {
                    name: "Длина",
                    unit: "м"
                },
                elements: [
                    {
                        type: "text",
                        text: data.length
                    }
                ]
            }
        )
    }

    return offer
}

exports.siteMapCreate = async (req: Request, res: Response) => {
    // res.contentType('application/xml')

    const fuse = false

    if (fuse) {
        return res.status(200).send({
            message: 'No',
        })
    }

    const filePath = "utils/turboYML.xml";
    const tempLocalFile = path.join(os.tmpdir(), filePath);
    const tempLocalDir = path.dirname(tempLocalFile);

    //Cloud storage files
    const bucket = admin.storage().bucket()
    const fileYML = bucket.file(filePath)
    // Create the temp directory where the storage file will be downloaded.
    await mkdirp(tempLocalDir)
    // Download file from bucket.
    await fileYML.download({ destination: tempLocalFile });
    //Get metadata YML
    const metaYML = await fileYML.getMetadata()
    // Get houses older sitemap data changed
    const housesRef = db.collection('houses_public')

    //Meta for set YML file
    //Если изменений нет, обновляем метатег для обновления даты файла
    const meta = {
        metadata: {
            changedAt: new Date(),
        }
    }

    //const dataForTest = new Date(2012)
    //const snapshot = await housesRef.where('changedAt', '>', dataForTest).limit(5).get()

    const snapshot = await housesRef.where('changedAt', '>=', metaYML[1].body.updated).limit(10).get()
    //const snapshot = { empty: true }  //for test

    console.log(metaYML[1].body.metadata.changedAt)

    if (snapshot.empty) {
        await fileYML.setMetadata(meta)
        return res.status(200).send({
            message: 'Изменений нет',
        })
    }

    //Если есть подготавливаем XML --> XMLjson

    const readXML = fs.readFileSync(tempLocalFile, "utf8");
    let fileYMLjson = convert.xml2json(readXML, { compact: false, spaces: 1 });
    let JSparse = JSON.parse(fileYMLjson)
    let elements = JSparse.elements[0].elements[0].elements[7].elements

    // console.log(
    //     util.inspect(JSparse.elements[0].elements[0].elements[7].elements, {
    //         showHidden: false,
    //         depth: 2,
    //         colors: true
    //     })
    // );

    snapshot.forEach((doc: any) => {
        const parsing = housesParse(doc.data())
        const indexArr = elements.findIndex((item: any) => (
            item.attributes.id === doc.id
        ))

        if (indexArr > -1) {
            parsing ? elements[indexArr] = parsing : elements.splice(indexArr, 1)
        } else {
            parsing ? elements.push(parsing) : console.log('exit')
        }

        console.log("forEach ==>", { parsing: parsing, docId: doc.id, indexArr: indexArr })
        // console.log(
        //     util.inspect(JSparse.elements[0].elements[0].elements[7].elements, {
        //         showHidden: false,
        //         depth: 2,
        //         colors: true
        //     })
        // );
    });

    //Закидываем XML обратно на диск

    const JSONparse = JSON.stringify(JSparse)
    const fileYMLupd = convert.json2xml(JSONparse, { spaces: 2 })
    fs.writeFileSync(tempLocalFile, fileYMLupd);
    await bucket.upload(tempLocalFile, { destination: filePath, metadata: meta })

    res.send("<p>Данные загружены<p />"); //write a response to the client

}

