
import { AnyAction } from 'redux'
//import MyPurchase from '../../components/my_purchases/MyPurchase';
import { loadState } from '../../redux/localStorage'
import { PaysBillType } from '../../util/types';
import {
    SET_MOBILE_OPEN,
    SET_MOBILE_OPEN_FALSE,
    SET_SIGNED,
    SET_UN_SIGNED,
    // SET_PROFILE_FIRST_TIME,
    SET_ALERT_OFF,
    SET_ALERT_ON,
    SET_BACKDROP_ON,
    SET_BACKDROP_OFF,
    SET_LINEAR_ON,
    SET_LINEAR_OFF,
    SET_FILTER,
    RESET_FILTER,
    // SET_PAY_VIEW,
    SET_CONFIG,
    PUSH_MY_PURCHASES,
    UPDATE_MY_PURCHASE,
    DELETE_MY_PURCHASE,
} from '../types';



// const initialFilter = {
//     typeBuilding: false,
//     material: false,
//     concreteType: false,
//     blockType: false,
//     woodType: false,
//     '0.5': false,
//     '1': false,
//     '1.5': false,
//     '2': false,
//     '2.5': false,
//     '3': false,
//     minArea: '',
//     maxArea: ''
// }

export type FilterType = {
    typeBuilding: string | false,
    material: string | false,
    concreteType: string | false,
    blockType: string | false,
    woodType: string | false,
    '0.5': boolean,
    '1': boolean,
    '1.5': boolean,
    '2': boolean,
    '2.5': boolean,
    '3': boolean,
    minArea: string,
    maxArea: string
}

const initialFilter: FilterType = {
    typeBuilding: false,
    material: false,
    concreteType: false,
    blockType: false,
    woodType: false,
    '0.5': false,
    '1': false,
    '1.5': false,
    '2': false,
    '2.5': false,
    '3': false,
    minArea: '',
    maxArea: ''
}

type InitialStateType = {
    filter: FilterType,
    mobileOpen: boolean,
    login: boolean,
    displayName: string | null,
    photoURL: string | null,
    email: string | null,
    uid: string | null,
    configuration: {
        updateStatus: boolean,
        textupdateStatus: string,
        contact: string
    },
    alertOn: boolean,
    alertMessage: string,
    backdrop: boolean,
    linear: boolean,
    myPurchases: PaysBillType[]
}

const initialState: InitialStateType = {
    filter: loadState('filter') || initialFilter,
    mobileOpen: false,
    login: false,
    displayName: null,
    photoURL: null,
    email: null,
    uid: null,
    configuration: {
        updateStatus: false,
        textupdateStatus: '',
        contact: ''
    },
    //profileFirstTime: false,
    alertOn: false,
    alertMessage: '',
    backdrop: false,
    linear: false,
    // payView: {
    //     view: false,
    //     index: 0
    // },
    myPurchases: [
        // {
        //     billId: "cc961e8d-d4d6-4f02-b737-2297e51fb48e",
        //     amount: {
        //         value: 25000,
        //         currency: "RUB",
        //     },
        //     customField: {
        //         houseIdName: 'Дом с кирпича',
        //         payIdName: 'Проект полностью'
        //     },
        //     status: {
        //         value: 'PAID',
        //         changedDateTime: '2021-01-18T14:36:17.65+03:00'
        //     },
        //     customer: {
        //         phone: '89232470174',
        //         account: "nffhbHBHbhdbj8jndjeihfrfnb",
        //         email: "kurochen@Mail.com"
        //     },
        //     payUrl: "https://oplata.qiwi.com/form/?invoice_uid=aa0fa2bb-5452-47ca-9190-cd9c1a73718f",
        //     creationDateTime: '2021-01-18T14:22:56.672+03:00',
        //     expirationDateTime: '2021-12-10T09:02:00+03:00',
        // }
    ]
}

export default function (state = initialState, action: AnyAction): InitialStateType {
    switch (action.type) {
        // case SET_PAY_VIEW:
        //     return {
        //         ...state,
        //         payView: {
        //             view: !state.payView.view,
        //             index: action.index
        //         }
        //     }
        case SET_CONFIG:
            return {
                ...state,
                configuration: { ...action.payload }
            }
        case SET_FILTER:
            return {
                ...state,
                filter: { ...state.filter, ...action.payload }
            }
        case RESET_FILTER:
            return {
                ...state,
                filter: initialFilter
            }
        case SET_MOBILE_OPEN:
            return {
                ...state,
                mobileOpen: !state.mobileOpen
            };
        case SET_MOBILE_OPEN_FALSE:
            return {
                ...state,
                mobileOpen: false
            }
        case SET_SIGNED:
            return {
                ...state,
                login: true,
                displayName: action.user.displayName,
                photoURL: action.user.photoURL,
                email: action.user.email,
                uid: action.user.uid
            };
        case SET_UN_SIGNED:
            return {
                ...state,
                login: false,
                displayName: null,
                photoURL: null,
                email: null,
                uid: "anonymous"
            }
        // case SET_PROFILE_FIRST_TIME:
        //     return {
        //         ...state,
        //         profileFirstTime: true
        //     }
        case SET_ALERT_ON:
            return {
                ...state,
                alertOn: true,
                alertMessage: action.payload,
            }
        case SET_ALERT_OFF:
            return {
                ...state,
                alertOn: false,
                alertMessage: '',
            }
        case SET_BACKDROP_ON:
            return {
                ...state,
                backdrop: true
            }
        case SET_BACKDROP_OFF:
            return {
                ...state,
                backdrop: false
            }
        case SET_LINEAR_ON:
            return {
                ...state,
                linear: true
            }
        case SET_LINEAR_OFF:
            return {
                ...state,
                linear: false
            }
        case PUSH_MY_PURCHASES:
            return {
                ...state,
                myPurchases: [...action.payload]
            }
        case UPDATE_MY_PURCHASE:
            const newArr = state.myPurchases.map((item: PaysBillType) => {
                if (item.qiwiData.billId === action.payload.qiwiData.billId) {
                    return action.payload
                }
                return item
            })
            return {
                ...state,
                myPurchases: newArr
            }
        case DELETE_MY_PURCHASE:
            const newArr2 = state.myPurchases.filter((item: PaysBillType) => (
                item.qiwiData.billId !== action.payload
            ))
            return {
                ...state,
                myPurchases: newArr2
            }
        default:
            return state
    };
}