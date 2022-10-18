import { QuerySnapshot } from 'firebase/firestore';
import { AnyAction } from 'redux';
import { HousePublicType, HousesPrivateType, UsersPrivateType, UsersPublicType } from '../../util/types';
import {
    SET_USER_PROFILE,
    SET_USER_PRIVATE_PROFILE,
    SET_HOUSES_USER,
    SET_HOUSE_PRIVATE_USER,
    //PUSH_HOUSE_HOUSES_USER, //к удалению
    UPDATE_USER_PROFILE,
    UPDATE_USER_PRIVATE_PROFILE,
    SET_PAGINATION_PAGE_USER,
    PUSH_SNAPSHOT_USER,
    SET_PAGINATION_COUNT_USER,
    RESET_SNAPSHOT_AND_PAGINATION_USER,
    SET_CURRENT_PROFILE_ID
} from '../types';

type InitialStateType = {
    //querySnapshots: [],
    snapshot: QuerySnapshot[],
    houses: HousePublicType[],
    housePrivate: HousesPrivateType,
    user: UsersPublicType,
    userPrivate: UsersPrivateType,
    pagination: {
        /**
         * test commen
         */
        count: number,
        page: number,
        reset: number,
        profileId: null | string
    }
}

const initialState: InitialStateType = {
    //querySnapshots: [],
    snapshot: [],
    houses: [],
    housePrivate: { pays: {} },
    user: {
        name: '',
        bio: '',
        city: '',
        linkVK: '',
        linkFH: '',
    },
    userPrivate: {
        phone: '',
        secretKeyQiwi: '',
        publicKeyQiwi: ''
    },
    pagination: {
        count: 1,
        page: 1,
        reset: 0,
        profileId: null
    }
}

export default function (state = initialState, action: AnyAction): InitialStateType {
    switch (action.type) {
        case SET_USER_PROFILE:
            return {
                ...state,
                user: { ...action.payload }
            };
        case SET_USER_PRIVATE_PROFILE:
            console.log("reducer set user private work action payload =>", action.payload)
            return {
                ...state,
                userPrivate: { ...action.payload }
            };
        case UPDATE_USER_PROFILE:
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            }
        case UPDATE_USER_PRIVATE_PROFILE:
            return {
                ...state,
                userPrivate: { ...state.userPrivate, ...action.payload }
            }
        case SET_HOUSES_USER:
            return {
                ...state,
                houses: action.payload
            };
        case SET_HOUSE_PRIVATE_USER:
            return {
                ...state,
                housePrivate: {
                    pays: { ...action.payload.pays }
                }
            };
        // case PUSH_HOUSE_HOUSES_USER:
        //     let house = action.payload.house;
        //     house.houseId = action.payload.houseId
        //     return {
        //         ...state,
        //         houses: [house, ...state.houses]
        //     };
        case SET_PAGINATION_COUNT_USER:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    count: action.payload
                }
            }
        case SET_PAGINATION_PAGE_USER:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.payload
                }
            }
        case PUSH_SNAPSHOT_USER:
            return {
                ...state,
                snapshot: [...state.snapshot, action.payload]
            }
        case RESET_SNAPSHOT_AND_PAGINATION_USER:
            return {
                ...state,
                snapshot: [],
                pagination: { profileId: null, count: 1, page: 1, reset: state.pagination.reset + 1 }
            }
        case SET_CURRENT_PROFILE_ID:
            return {
                ...state,
                pagination: { ...state.pagination, profileId: action.payload }
            }
        default:
            return state
    };
}