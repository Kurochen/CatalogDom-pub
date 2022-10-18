const { admin, db } = require('../util/admin')
const { housesParse } = require('../handlers/util')

const data = {
    userEmail: "kurochen888@gmail.com",
    houseId: '12345',
    name: "TestDom",
    visible: true,
    pays: {
        1: {
            price: 10000
        }
    },
    images: {
        1: {
            urlBig: 'http://site/image/1'
        },
        3: {
            urlBig: 'http://site/image/3'
        },
        4: {
            urlBig: 'http://site/image/4'
        },
        10: {
            urlBig: 'http://site/image/10'
        },
    },
    description: "Описание всякой ерунды",
    material: {
        name: "Дерево",
        woodType: "Бревно"
    }
}

const dataExit = {
    attributes: {
        id: "12345",
    },
    elements: [
        {
            elements: [
                {
                    text: "TestDom",
                    type: "text",
                },
            ],
            name: "name",
            type: "text",
        },
        {
            elements: [
                {
                    text: "kurochen888@gmail.com",
                    type: "text",
                },
            ],
            name: "vendor",
            type: "element",
        },
        {
            elements: [
                {
                    text: "https://catalogdom.web.app/viewhouse/12345",
                    type: "text",
                },
            ],
            name: "url",
            type: "element",
        },
        {
            elements: [
                {
                    text: "true",
                    type: "text",
                },
            ],
            name: "downloadable",
            type: "element",
        },
        {
            elements: [
                {
                    text: "RUR",
                    type: "text",
                },
            ],
            name: "currencyId",
            type: "element",
        },
        {
            elements: [
                {
                    text: 1,
                    type: "text",
                },
            ],
            name: "categoryId",
            type: "element",
        },
        {
            elements: [
                {
                    text: 10000,
                    type: "text",
                },
            ],
            name: "price",
            type: "element",
        },
        {
            elements: [
                {
                    text: "http://site/image/1",
                    type: "text",
                },
            ],
            name: "picture",
            type: "element",
        },
        {
            elements: [
                {
                    text: "http://site/image/3",
                    type: "text",
                },
            ],
            name: "picture",
            type: "element",
        },
        {
            elements: [
                {
                    text: "http://site/image/4",
                    type: "text",
                },
            ],
            name: "picture",
            type: "element",
        },
        {
            elements: [
                {
                    text: "http://site/image/10",
                    type: "text",
                },
            ],
            name: "picture",
            type: "element",
        },
        {
            elements: [
                {
                    type: "text",
                    text: "Описание всякой ерунды",
                },
            ],
            name: "description",
            type: "element",
        },
        {
            "attributes": {
                name: "Материал",
            },
            elements: [
                {
                    text: "Бревно",
                    type: "text",
                },
            ],
            name: "param",
            type: "element",
        },
    ],
    name: "offer",
    type: "element",
}


test("housesParse", async () => {
    //  const houseRef = db.collection('houses_public').doc('4sSMu5wOULof3D5KSbyI');
    //  const data = await houseRef.get()
    expect(housesParse(data)).toEqual(dataExit)
})