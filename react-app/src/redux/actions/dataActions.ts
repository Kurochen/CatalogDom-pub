import {
    PUSH_HOUSE_HOUSES_USER,
    SET_LINEAR_ON,
    SET_LINEAR_OFF,
    SET_HOUSE_PUBLIC,
    SET_HOUSE_FOR_EDIT,
    SET_IMAGE_WAIT,
    SET_IMAGE_DELETE,
    SET_ALERT_ON,
    SET_BACKDROP_ON,
    SET_BACKDROP_OFF,
    UPDATE_MAIN_ATRIBUTES_HOUSE,
    UPDATE_MATERIAL_ATRIBUTES_HOUSE,
    UPDATE_PAY_ATRIBUTES_HOUSE,
    SET_HOUSES,
    PUSH_SNAPSHOT,
    PAGINATION_COUNT_INCREMENT,
    RESET_SNAPSHOT_AND_PAGINATION,
    SET_PAGINATION_COUNT,
    SET_PAGINATION_PAGE,
    RESET_SNAPSHOT_AND_PAGINATION_USER

} from '../types'
import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import store, { RootState } from '../store'
import { axiosApp } from '../../util/axiosApp'
import { FilterType } from '../reducers/uiReducer'
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, Query, startAfter, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { HousePublicType, HousesPrivateType } from '../../util/types'
import firebaseApp from '../../util/firebaseApp'

import { getAnalytics, logEvent } from "firebase/analytics";
import ym from 'react-yandex-metrika';
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp);


const analytics = getAnalytics(firebaseApp);

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>

const filterQuery = (filterState: FilterType, q: Query) => {
    const max = +process.env.REACT_APP_MAX_HOUSES_HOME!
    let floors = [] // ohly one multiple method for firestore query allow

    if (filterState == null || filterState === undefined) {
        console.log('warning return')
        return q
    }

    for (let [key, value] of Object.entries(filterState)) {
        switch (key) {
            case 'typeBuilding':
                if (value !== false) {
                    q = query(q, where(key, '==', value))
                }
                break
            case 'material':
                if (value !== false) {
                    q = query(q, where(`${key}.name`, '==', value))
                }
                break;
            case 'concreteType':
            case 'blockType':
            case 'woodType':
                if (value !== false) {
                    q = query(q, where(`material.${key}`, '==', value))
                }
                break;
            case '0.5':
            case '1':
            case '1.5':
            case '2':
            case '2.5':
            case '3':
                if (value !== false) {
                    floors.push(Number(key))
                }
                break;
            case 'minArea':
                if (value !== '') {
                    q = query(q, where(`area`, '>=', Number(value)))
                }
                break;
            case 'maxArea':
                if (value !== '') {
                    q = query(q, where(`area`, '<=', Number(value)))
                }
                break;
            default:
                console.log('Work queryFulter default')
        }
    }

    if (floors.length !== 0) {
        q = query(q, where('floors', 'in', floors))
    }

    q = query(q, where(`verifiedUser`, '==', true))
    q = query(q, where(`visible`, '==', true))
    q = query(q, orderBy('area'))
    q = query(q, limit(max));
    return q;
}
// 

export const resetSnapshotPagination = () => ({
    type: RESET_SNAPSHOT_AND_PAGINATION,
})


export const getHouseAll = (event: any, page: number): AppThunk => async dispatch => {

    const max = +process.env.REACT_APP_MAX_HOUSES_HOME!
    const snapshotsState = store.getState().data.snapshot
    const filterState = store.getState().UI.filter
    const pageState = store.getState().data.pagination.page
    const countState = store.getState().data.pagination.count
    let q = query(collection(db, 'houses_public'))
    let snapshot = {}
    let houses: {}[] = [];

    if (page === undefined) {
        page = pageState
    }

    if (snapshotsState[page - 1]) {
        if (Object.keys(snapshotsState[page - 1]).length === 0) {
            return
        }
        snapshotsState[page - 1].forEach((doc) => {
            let house = doc.data();
            house.houseId = doc.id
            houses.push(house)
        })
        dispatch({ type: SET_HOUSES, payload: houses })
        dispatch({ type: SET_PAGINATION_PAGE, payload: page })

    } else if (page === 1) {
        getDocs(filterQuery(filterState, q))
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    snapshot = querySnapshot
                    let house = doc.data();
                    house.houseId = doc.id
                    houses.push(house)
                })
                dispatch({ type: SET_HOUSES, payload: houses })
                dispatch({ type: PUSH_SNAPSHOT, payload: snapshot })
                if (houses.length === max) {
                    console.log("(houses.length === max) houses.length =>", houses.length)
                    dispatch({ type: SET_PAGINATION_COUNT, payload: countState + 1 })
                }
                if (houses.length === 0) {
                    console.log("houses.length === 0) houses.length =>", houses.length)
                    dispatch({ type: SET_PAGINATION_COUNT, payload: countState - 1 })
                }
            }).catch((error) => {
                dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения домов" });
                console.log("Error kurochen getting documents: ", error);
            });
    } else {
        const lastVisibleDoc = snapshotsState[page - 2].docs[snapshotsState[page - 2].docs.length - 1]
        q = filterQuery(filterState, q)
        q = query(q, startAfter(lastVisibleDoc))
        getDocs(q)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    snapshot = querySnapshot
                    let house = doc.data();
                    house.houseId = doc.id
                    houses.push(house)
                })
                if (houses.length === 0) {
                    dispatch({ type: SET_ALERT_ON, payload: "Все, больше нету" });
                    dispatch({ type: SET_PAGINATION_COUNT, payload: countState - 1 })

                } else if (houses.length < max) {
                    dispatch({ type: SET_HOUSES, payload: houses })
                    dispatch({ type: PUSH_SNAPSHOT, payload: snapshot })
                    dispatch({ type: SET_PAGINATION_PAGE, payload: page })
                    console.log("countState = page")
                } else {
                    dispatch({ type: SET_HOUSES, payload: houses })
                    dispatch({ type: PUSH_SNAPSHOT, payload: snapshot })
                    dispatch({ type: SET_PAGINATION_PAGE, payload: page })
                    dispatch({ type: SET_PAGINATION_COUNT, payload: countState + 1 })
                }

            }).catch((error) => {
                dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения домов" });
                console.log("Error kurochen getting documents: ", error);
            });
    }
}

export const getHouseIdDB = (idHouse: string): AppThunk => dispatch => {
    dispatch({ type: SET_BACKDROP_ON })
    const docPublicRef = doc(db, 'houses_public', idHouse);
    getDoc(docPublicRef)
        .then((doc) => {
            if (doc.exists()) {
                dispatch({ type: SET_HOUSE_PUBLIC, payload: doc.data() })
                dispatch({ type: SET_BACKDROP_OFF })

                logEvent(analytics, "page_view", {
                    page_path: `viewhouse/${idHouse}`,
                    page_title: doc.data().name,
                });

                ym('hit', `viewhouse/${idHouse}`, {
                    title: doc.data().name,
                });

                console.log(doc.data().name)

            } else {
                dispatch({ type: SET_ALERT_ON, payload: 'Объект не найден' });
                dispatch({ type: SET_BACKDROP_OFF })
            }
        }).catch((error) => {
            console.log("Error getting document", error);
        });
}

// REFACTORING THIS SHIT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export const getHouseForEdit = (idHouse: string): AppThunk => async dispatch => {
    let resultData: { public?: HousePublicType, private?: HousesPrivateType } = {}
    dispatch({ type: SET_BACKDROP_ON })
    const docPublicRef = doc(db, 'houses_public', idHouse);
    const docPrivateRef = doc(db, 'houses_private', idHouse);
    const results: any = await Promise.all([
        getDoc(docPublicRef),
        getDoc(docPrivateRef)
    ]).catch((error) => {
        console.log("Error getting document", error);
    })

    if (!results[0].exists()) {
        dispatch({ type: SET_ALERT_ON, payload: 'Объект не найден' });
    } else {
        resultData.public = results[0].data()

        if (results[1].exists) {
            resultData.private = results[1].data()

            if (resultData.private === undefined) {
                resultData.private = { pays: {} }
            }

            Object.entries(resultData.private!.pays!).map((key: any) => {   //merge two map. Push in resultData.public "link" from resultData.private
                if (resultData.public!.pays === undefined) {
                    resultData.public!.pays = {}
                }
                let payPublic = resultData.public!.pays[key[0]]       // pay Object,  key[0] = item
                let payPrivate = key[1]                              // pay Object,  {link: 'xxx'}

                if (payPublic === undefined) {
                    payPublic = {} // awoid undefined
                }
                payPublic.link = payPrivate.link
            })
        }
    }
    console.log('getHouseForEdit resultData', resultData.public)
    dispatch({ type: SET_HOUSE_PUBLIC, payload: resultData.public });
    dispatch({ type: SET_BACKDROP_OFF })
}


export const editPayAtributes = (dirtyData: any): AppThunk => async dispatch => {
    dispatch({ type: SET_BACKDROP_ON })
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)

    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'put',
        url: 'api/house/editPay',
        data: dirtyData
    }).then((res) => {
        dispatch({ type: UPDATE_PAY_ATRIBUTES_HOUSE, payload: res.data });
        dispatch({ type: SET_ALERT_ON, payload: res.data.message });
        dispatch({ type: SET_BACKDROP_OFF });
        console.log('dataActions res.data =>', res.data)
    })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: `Ошибка` });
            dispatch({ type: SET_BACKDROP_OFF });
            console.table(err.response); // todo table form
        })
}

export const editMaterial = (dirtyData: any) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON })
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)

    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'put',
        url: 'api/house/editMaterial',
        data: dirtyData
    }).then((res) => {
        dispatch({ type: UPDATE_MATERIAL_ATRIBUTES_HOUSE, payload: res.data });
        dispatch({ type: SET_ALERT_ON, payload: res.data.message });
        dispatch({ type: SET_BACKDROP_OFF });
        console.log('dataActions res.data =>', res.data)
    })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: "Ошибка" });
            dispatch({ type: SET_BACKDROP_OFF });
            console.table(err.response); // todo table form
        })
}

export const editMainAtributes = (dirtyData: any) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON })
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)
    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'put',
        url: 'api/house/editMainAtributes',
        data: dirtyData
    }).then((res) => {
        dispatch({ type: UPDATE_MAIN_ATRIBUTES_HOUSE, payload: res.data.house });
        dispatch({ type: SET_ALERT_ON, payload: res.data.message });
        dispatch({ type: SET_BACKDROP_OFF });
        console.log('dataActions res.data =>', res.data)
    })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: "err.response" });
            dispatch({ type: SET_BACKDROP_OFF });
            console.table(err.response);
        })
}

export const uploadImage = (formData: any): AppThunk => async dispatch => {
    dispatch({ type: SET_BACKDROP_ON })
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)
    console.log('actions uoload Image formData =>', formData)
    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'post',
        url: 'api/imageUpload',
        data: formData
    })
        .then((res) => {
            dispatch({ type: SET_BACKDROP_OFF });
            dispatch({ type: SET_IMAGE_WAIT, payload: res.data })
            dispatch({ type: SET_ALERT_ON, payload: `${res.data.message} Для отображения изменений обновите страницу.` });
        })
        .catch((err) => {
            dispatch({ type: SET_BACKDROP_OFF });
            dispatch({ type: SET_ALERT_ON, payload: 'Ошибка загрузки' });
            console.log('UplaoadImage actions client err =>', err.response)
        })
}

export const deleteImage = (data: any) => async (dispatch: any) => {
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)
    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'delete',
        url: 'api/house/imageDelete',
        data: data
    })
        .then((res) => {
            dispatch({ type: SET_IMAGE_DELETE, payload: res.data })
            dispatch({ type: SET_ALERT_ON, payload: res.data.message });
            console.log('Ответ сервера ImageUpload', res)
        })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: 'Ошибка удаления' });
            console.log('UplaoadImage actions client err =>', err.response)
        })

}

export const deleteHouse = (data: any, history: any) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON })
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)
    const uid = await store.getState().UI.uid

    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'delete',
        url: 'api/house/deleteHouse',
        data: data
    })
        .then((res) => {
            history.push(`/profile/${uid}`);
            //dispatch({ type: SET_HOUSE_DELETE, payload: res.data })
            dispatch({ type: RESET_SNAPSHOT_AND_PAGINATION_USER })
            dispatch({ type: SET_ALERT_ON, payload: res.data.message });
            console.log('Ответ сервера deleteHouse', res)

            dispatch({ type: SET_BACKDROP_OFF })
        })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: 'Ошибка удаления' });
            dispatch({ type: SET_BACKDROP_OFF })
            console.log('UplaoadImage actions client err =>', err.response)
        })

}
