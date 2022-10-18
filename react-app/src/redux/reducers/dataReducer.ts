import { QuerySnapshot } from 'firebase/firestore';
import { AnyAction } from 'redux'
import { HousePublicType } from '../../util/types';
import {
    PAGINATION_COUNT_INCREMENT,
    PUSH_SNAPSHOT,
    //    RESET_SNAPSHOT,
    SET_HOUSES,
    SET_IMAGE_DELETE,
    SET_IMAGE_WAIT,
    //    ADD_NEW_HOUSE,
    SET_HOUSE_PUBLIC,
    UPDATE_MAIN_ATRIBUTES_HOUSE,
    UPDATE_MATERIAL_ATRIBUTES_HOUSE,
    UPDATE_PAY_ATRIBUTES_HOUSE,
    RESET_SNAPSHOT_AND_PAGINATION,
    SET_PAGINATION_COUNT,
    SET_PAGINATION_PAGE
} from '../types';

type InitialStateType = {
    house: HousePublicType,
    houses: HousePublicType[],
    snapshot: QuerySnapshot[],
    pagination: {
        count: number
        page: number
    }
}

const initialState: InitialStateType = {
    house: {},
    houses: [],
    snapshot: [],
    pagination: {
        count: 1,
        page: 1
    }
};

export default function (state = initialState, action: AnyAction): InitialStateType {
    switch (action.type) {
        case SET_PAGINATION_COUNT:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    count: action.payload
                }
            }
        case SET_PAGINATION_PAGE:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.payload
                }
            }
        case RESET_SNAPSHOT_AND_PAGINATION:
            return {
                ...state,
                snapshot: [],
                pagination: { count: 1, page: 1 }
            }
        case PAGINATION_COUNT_INCREMENT:
            console.log('dataReducer pgination shoot')
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    count: state.pagination.count + 1
                }
            }
        case PUSH_SNAPSHOT:
            return {
                ...state,
                snapshot: [...state.snapshot, action.payload]
            }
        case SET_HOUSES:
            return {
                ...state,
                houses: action.payload
            };
        case SET_HOUSE_PUBLIC:
            return {
                ...state,
                house: {
                    ...action.payload,
                    material: { ...action.payload.material },
                    images: { ...action.payload.images },
                    pays: { ...action.payload.pays }
                }
            }
        case UPDATE_MAIN_ATRIBUTES_HOUSE:
            return {
                ...state,
                house: { ...state.house, ...action.payload }
            }
        case UPDATE_MATERIAL_ATRIBUTES_HOUSE:
            return {
                ...state,
                house: {
                    ...state.house,
                    changedAt: { ...action.payload.changedAt },
                    material: {
                        ...action.payload.house
                    }
                }
            }
        case UPDATE_PAY_ATRIBUTES_HOUSE:
            let item = action.payload.item;
            return {
                ...state,
                house: {
                    ...state.house,
                    changedAt: { ...action.payload.changedAt },
                    pays: {
                        ...state.house.pays,
                        [item]: { ...state.house.pays![item], ...action.payload.pay }
                    }
                }
            }
        case SET_IMAGE_WAIT:
            return {
                ...state,
                house: {
                    ...state.house,
                    images: {
                        ...state.house.images,
                        [action.payload.item]: {
                            title: action.payload.title,
                            urlSmall: process.env.PUBLIC_URL + '/img/wait.png'
                        }
                    }
                }
            }
        case SET_IMAGE_DELETE:
            return {
                ...state,
                house: {
                    ...state.house,
                    images: {
                        ...state.house.images,
                        [action.payload.item]: {}
                    }
                }
            }

        default:
            return state
    }
}
