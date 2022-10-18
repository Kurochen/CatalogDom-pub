export type ImageType = {
    title?: string | null,
    urlBig?: string,
    urlSmall?: string,
    token?: string
}

export type HousePublicType = {
    userId?: string
    houseId: string,
    userEmail?: string,
    name?: string
    area?: number | null,
    length?: number | null
    width?: number | null
    length_2?: number | null
    width_2?: number | null
    visible?: boolean
    verifiedUser?: boolean
    changedAt?: any,
    createdAt?: any,
    description?: string,
    floors?: 0.5 | 1 | 1.5 | 2 | 2.5 | 3,
    roof?: "Плоская" | "Односкатная" | "Двухскатная" | "Четырехскатная" | "Другое"
    foundation?: 'Сваи' | "Лента" | "Плита" | "Подвал" | "Другое",
    images?: {
        [key: number]: ImageType
    },
    pays?: {
        [item: number]: {
            title?: string | null,
            description?: string | null,
            price?: number | null,
            link?: string | null //нужна в датаАктионс удалить в будущем
        }
    },
    typeBuilding?: "Дом" | "Баня",
    material?: {
        name?: "Другое",
        materialAnotherType?: string,
        widthMaterial?: number,
    } | {
        name: "Кирпич",
        widthMaterial?: number
    } | {
        name: "Блоки",
        blockType?: "Другое" | "Пенобетон" | "Газобетон" | "Керамика" | "Арболит"
        keramikaType?: string | null
        widthMaterial?: string | null
    } | {
        name: "Дерево",
        brusHeight?: number | null
        brusWidth?: number | null
        woodType?: "Брус" | "Бревно" | "Каркас" | "Панели" | "Другое"
        widthMaterial?: string | null
    } | {
        name: "Бетон",
        concreteType?: "Другое" | "Каркас" | "Монолит"
        widthMaterial?: string | null
    }
}

export type HousesPrivateType = {
    pays?: {
        [key: number]: {
            link?: string | null,
        }
    },
}

/** This is a description of the foo function. */

export type PaysBillType = {
    changedAt: any
    changedSellerAccountMoney?: boolean
    qiwiData: {
        amount: {
            currency: 'RUB',
            value: string
        },
        billId: string,
        comment?: string
        creationDataTime: string
    }
    customFields: {
        CHECKOUT_REFERER: string,
        apiClient: string,
        apiClientVersion: string,
        houseId: string,
        houseIdName: string,
        linkProject?: string,
        linkProjectSnapshot: string,
        payIdName: string,
        sellerId: string,
        sellerEmail?: string,
        sellerPhone?: string,
        userId: string
    },
    expirrationDataTime: string,
    payUrl?: string,
    status: {
        changedDateTime: string,
        value: string
    },
    userId: string
}

export type UsersPrivateType = {
    changedAt?: any,
    phone?: string,
    publicKeyQiwi?: string,
    secretKeyQiwi?: string
}

export type UsersPublicType = {
    changedAt?: any,
    accountMoney?: number,
    city?: string,
    bio?: string | null,
    linkFH?: string | null,
    linkVK?: string | null,
    name?: string | null,
    numberHouses?: number,
    verified?: boolean
}

export type ConfigType = {
    contact: string,
    textUpdateStatus: string,
    updateStatus: boolean
}