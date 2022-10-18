import {
    SET_USER_PROFILE,
    SET_USER_PRIVATE_PROFILE,
    SET_PROFILE_FIRST_TIME,
    SET_ALERT_ON,
    SET_LINEAR_ON,
    SET_LINEAR_OFF,
    SET_BACKDROP_ON,
    SET_BACKDROP_OFF,
    SET_HOUSES_USER,
    SET_HOUSE_PUBLIC_USER,
    SET_HOUSE_PRIVATE_USER,
    PUSH_HOUSE_HOUSES_USER,
    UPDATE_USER_PROFILE,
    UPDATE_USER_PRIVATE_PROFILE,
    SET_PAGINATION_PAGE_USER,
    SET_PAGINATION_COUNT_USER,
    PUSH_SNAPSHOT_USER,
    RESET_SNAPSHOT_AND_PAGINATION_USER,
    SET_CURRENT_PROFILE_ID
} from '../types'

import store from '../store'
import { axiosApp } from '../../util/axiosApp';
import { doc, getDoc, getDocs, getFirestore, query, collection, where, startAfter, orderBy, limit, Query } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import firebaseApp from '../../util/firebaseApp';
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp);

//*     =====   PAGINATION  =====*/


// const filterQuery__ = (idUser: string, q: any) => {
//     const uid = store.getState().UI.uid
//     //const max = +process.env.REACT_APP_MAX_HOUSES_HOME
//     const max = 2
//     console.log("filterQuery uid ==>", uid)


//     if (uid !== idUser) {
//         q = q.where("verifiedUser", '==', true)
//         q = q.where("visible", '==', true)
//     }
//     q = q.where("userId", '==', idUser)
//     q = q.orderBy('changedAt', 'desc').limit(max);
//     return q;
// }

const filterQuery = (idUser: string, q: Query) => {

    const uid = store.getState().UI.uid
    const max = +process.env.REACT_APP_MAX_HOUSES_PROFILE!

    if (uid !== idUser) {
        q = query(q, where("verifiedUser", '==', true))
        q = query(q, where("visible", '==', true))
    }
    q = query(q, where("userId", '==', idUser))
    q = query(q, orderBy('changedAt', 'desc'))
    q = query(q, limit(max))
    return q;
}

// export const getHouseUserAll__ = (event: any, page: number, userId: string) => (dispatch: any) => { //defaulr arguments of pagination Material UI - {event, page}

//     //const max = +process.env.REACT_APP_MAX_HOUSES_HOME!
//     const max = 2
//     const snapshotsState = store.getState().userData.snapshot
//     const pageState = store.getState().userData.pagination.page
//     const countState = store.getState().userData.pagination.count
//     const profileId = store.getState().userData.pagination.profileId
//     const queryhousesRef = firebaseApp.firestore().collection('houses_public');
//     //const q = query(collection(db, 'houses_public'));
//     let snapshot = {}
//     let houses: {}[] = [];

//     console.group('getHouseUserAll');
//     console.log('userId - ', userId);
//     console.log('profileId - ', profileId);
//     console.log("snapshotsState - ", snapshotsState)
//     console.groupEnd();


//     if (page === undefined || page === null) {
//         console.log(" if page === undefined || page === null, page => ", page, 'pageState ==> ', pageState)
//         page = pageState
//     }

//     if (userId !== profileId && profileId !== null) {
//         dispatch({ type: RESET_SNAPSHOT_AND_PAGINATION_USER })
//         return
//     }

//     dispatch({ type: SET_CURRENT_PROFILE_ID, payload: userId })

//     if (snapshotsState[page - 1]) {
//         if (Object.keys(snapshotsState[page - 1]).length === 0) {
//             return
//         }
//         snapshotsState[page - 1].forEach((doc) => {
//             let house = doc.data();
//             house.houseId = doc.id
//             houses.push(house)
//         })
//         dispatch({ type: SET_HOUSES_USER, payload: houses })
//         dispatch({ type: SET_PAGINATION_PAGE_USER, payload: page })
//     } else if (page === 1) {
//         filterQuery(userId, queryhousesRef).get()
//             .then((querySnapshot: QuerySnapshot) => {
//                 querySnapshot.forEach((doc) => {
//                     snapshot = querySnapshot
//                     let house = doc.data();
//                     house.houseId = doc.id
//                     houses.push(house)
//                 })
//                 dispatch({ type: SET_HOUSES_USER, payload: houses })
//                 dispatch({ type: PUSH_SNAPSHOT_USER, payload: snapshot })
//                 if (houses.length === max) {
//                     console.log("(houses.length === max) houses.length =>", houses.length)
//                     dispatch({ type: SET_PAGINATION_COUNT_USER, payload: countState + 1 })
//                 }
//                 if (houses.length === 0) {
//                     console.log("houses.length === 0) houses.length =>", houses.length)
//                     dispatch({ type: SET_PAGINATION_COUNT_USER, payload: countState - 1 })
//                 }
//             }).catch((error: unknown) => {
//                 dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения домов" });
//                 console.log("Error kurochen getting documents: ", error);
//             });
//     } else {
//         const lastVisibleDoc = snapshotsState[page - 2].docs[snapshotsState[page - 2].docs.length - 1]
//         filterQuery(userId, queryhousesRef)
//             .startAfter(lastVisibleDoc)
//             .get()
//             .then((querySnapshot: QuerySnapshot) => {
//                 querySnapshot.forEach((doc) => {
//                     snapshot = querySnapshot
//                     let house = doc.data();
//                     house.houseId = doc.id
//                     houses.push(house)
//                 })
//                 if (houses.length === 0) {
//                     dispatch({ type: SET_ALERT_ON, payload: "Все, больше нету" });
//                     dispatch({ type: SET_PAGINATION_COUNT_USER, payload: countState - 1 })
//                 } else if (houses.length < max) {
//                     dispatch({ type: SET_HOUSES_USER, payload: houses })
//                     dispatch({ type: PUSH_SNAPSHOT_USER, payload: snapshot })
//                     dispatch({ type: SET_PAGINATION_PAGE_USER, payload: page })
//                 } else {
//                     dispatch({ type: SET_HOUSES_USER, payload: houses })
//                     dispatch({ type: PUSH_SNAPSHOT_USER, payload: snapshot })
//                     dispatch({ type: SET_PAGINATION_PAGE_USER, payload: page })
//                     dispatch({ type: SET_PAGINATION_COUNT_USER, payload: countState + 1 })
//                 }

//             }).catch((error: unknown) => {
//                 dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения домов" });
//                 console.error(error)
//             });
//     }
// }

export const getHouseUserAll = (event: any, page: number, userId: string) => async (dispatch: any) => { //defaulr arguments of pagination Material UI - {event, page}

    const max = +process.env.REACT_APP_MAX_HOUSES_PROFILE!
    const snapshotsState = store.getState().userData.snapshot
    const pageState = store.getState().userData.pagination.page
    const countState = store.getState().userData.pagination.count
    const profileId = store.getState().userData.pagination.profileId
    //const queryhousesRef = firebaseApp.firestore().collection('houses_public');
    let q = query(collection(db, 'houses_public'));
    let snapshot = {}
    let houses: {}[] = [];

    if (page === undefined || page === null) {
        page = pageState
    }

    if (userId !== profileId && profileId !== null) {
        dispatch({ type: RESET_SNAPSHOT_AND_PAGINATION_USER })
        return
    }

    dispatch({ type: SET_CURRENT_PROFILE_ID, payload: userId })

    if (snapshotsState[page - 1]) {
        if (Object.keys(snapshotsState[page - 1]).length === 0) {
            return
        }
        snapshotsState[page - 1].forEach((doc) => {
            let house = doc.data();
            house.houseId = doc.id
            houses.push(house)
        })
        dispatch({ type: SET_HOUSES_USER, payload: houses })
        dispatch({ type: SET_PAGINATION_PAGE_USER, payload: page })
    } else if (page === 1) {
        getDocs(filterQuery(userId, q))
            .then((querySnapshot) => {  // Не дает назначить тип QuerySnapshot. Возможно нужно переписать в async/await
                querySnapshot.forEach((doc) => {
                    snapshot = querySnapshot
                    let house: any = doc.data();
                    house.houseId = doc.id
                    houses.push(house)
                })
                dispatch({ type: SET_HOUSES_USER, payload: houses })
                dispatch({ type: PUSH_SNAPSHOT_USER, payload: snapshot })
                if (houses.length === max) {
                    dispatch({ type: SET_PAGINATION_COUNT_USER, payload: countState + 1 })
                }
                if (houses.length === 0) {
                    dispatch({ type: SET_PAGINATION_COUNT_USER, payload: countState - 1 })
                }
            }).catch((error: unknown) => {
                dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения домов" });
                console.log("Error kurochen getting documents: ", error);
            });
    } else {
        const lastVisibleDoc = snapshotsState[page - 2].docs[snapshotsState[page - 2].docs.length - 1]
        q = filterQuery(userId, q)
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
                    dispatch({ type: SET_PAGINATION_COUNT_USER, payload: countState - 1 })
                } else if (houses.length < max) {
                    dispatch({ type: SET_HOUSES_USER, payload: houses })
                    dispatch({ type: PUSH_SNAPSHOT_USER, payload: snapshot })
                    dispatch({ type: SET_PAGINATION_PAGE_USER, payload: page })
                } else {
                    dispatch({ type: SET_HOUSES_USER, payload: houses })
                    dispatch({ type: PUSH_SNAPSHOT_USER, payload: snapshot })
                    dispatch({ type: SET_PAGINATION_PAGE_USER, payload: page })
                    dispatch({ type: SET_PAGINATION_COUNT_USER, payload: countState + 1 })
                }

            }).catch((error: unknown) => {
                dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения домов" });
                console.error(error)
            });
    }
}


// export const resetSnapshot_Pagination = () => ({
//     type: RESET_SNAPSHOT_AND_PAGINATION_USER
// })



export const getUserProfileDB = (uid: string) => (dispatch: any) => {
    const docPublicRef = doc(db, 'users_public', uid)
    getDoc(docPublicRef)
        .then((doc) => {
            if (doc.exists()) { /// Убрать скобки
                dispatch({ type: SET_USER_PROFILE, payload: doc.data() })
            } else {
                console.log('No such document');
                //dispatch({ type: SET_PROFILE_FIRST_TIME })
                dispatch({ type: SET_ALERT_ON, payload: "Профиль еще не создан" });
            }
        })
        .catch(error => {
            console.log("Error getting document:", error);
            dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения профиля" });
        })
}

export const getUserPrivateProfileDB = (uid: string) => (dispatch: any) => {
    const docPrivateRef = doc(db, 'users_private', uid)
    getDoc(docPrivateRef)
        .then((doc) => {
            if (doc.exists()) {
                dispatch({ type: SET_USER_PRIVATE_PROFILE, payload: doc.data() })
            } else {
                console.log('Private profile not found');
            }
        })
        .catch(error => {
            console.log("Error getting document:", error);
            dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения приватного профиля" });
        })
}

export const getHouseIdPrivate = (idHouse: string) => (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON })
    const docPrivateRef = doc(db, 'houses_private', idHouse)
    getDoc(docPrivateRef)
        .then((doc) => {
            if (doc.exists()) {
                console.log('userDataActions housePrivate', doc.data())
                dispatch({ type: SET_HOUSE_PRIVATE_USER, payload: doc.data() })
                dispatch({ type: SET_BACKDROP_OFF })
            } else {
                console.log('userDataActions housePrivate netu')
                dispatch({ type: SET_BACKDROP_OFF })
            }
        }).catch((error) => {
            console.log("Error getting private document", error);
        });
}

// export const getHousesUserDB = (userId) => (dispatch) => {
//     const q = query(collection(db, 'houses_public'), where('userId', '==', userId))
//     getDocs(q)
//         .then((querySnapshot) => {
//             let houses = [];
//             querySnapshot.forEach((doc) => {
//                 let house = doc.data();
//                 house.houseId = doc.id
//                 houses.push(house)
//             })
//             dispatch({ type: SET_HOUSES_USER, payload: houses })
//         })
//         .catch(function (error) {
//             dispatch({ type: SET_ALERT_ON, payload: "Ошибка получения домов" });
//             console.log("Error kurochen getting documents: ", error);
//         });

// }

export const addNewHouseAC = (userInput: string) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON })
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)

    axiosApp({
        headers: { Authorization: `Bearer ${idToken}` },
        method: 'post',
        url: 'api/house/addNewHouse',
        data: { name: userInput }
    }).then((res) => {
        dispatch({ type: RESET_SNAPSHOT_AND_PAGINATION_USER })
        //dispatch({ type: PUSH_HOUSE_HOUSES_USER, payload: res.data })
        dispatch({ type: SET_BACKDROP_OFF })
        console.log("dataActions res => ", res.data)
    })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: err.response.data.message });
            dispatch({ type: SET_BACKDROP_OFF })
            console.log("Error", err.response);
        })
}


export const setUserProfileDB = (dirtyData: {}) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON });
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)

    axiosApp({
        headers: { Authorization: `Bearer ${idToken}` },
        method: 'put',
        url: 'api/user/setUserProfile',
        data: dirtyData
    })
        .then((res) => {
            dispatch({ type: UPDATE_USER_PROFILE, payload: res.data.user });
            dispatch({ type: SET_ALERT_ON, payload: res.data.message });
            dispatch({ type: SET_BACKDROP_OFF });
        })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: 'Ошибка обновления профиля' });
            dispatch({ type: SET_BACKDROP_OFF });
            console.error(err)
        })
}


export const setUserPrivateProfileDB = (dirtyData: {}) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON });
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)

    axiosApp({
        headers: { Authorization: `Bearer ${idToken}` },
        method: 'put',
        url: 'api/user/setUserPrivateProfile',
        data: dirtyData
    })
        .then((res) => {
            dispatch({ type: UPDATE_USER_PRIVATE_PROFILE, payload: res.data.user });
            dispatch({ type: SET_ALERT_ON, payload: res.data.message });
            dispatch({ type: SET_BACKDROP_OFF });
        })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: 'Ошибка обновления профиля' });
            console.log(err)
        })
}

export const setProfileId = (userId: string) => ({
    type: SET_CURRENT_PROFILE_ID, payload: userId
})