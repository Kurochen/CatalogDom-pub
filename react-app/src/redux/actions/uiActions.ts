import { saveState, resetState } from '../../redux/localStorage'
import {
    SET_MOBILE_OPEN,
    SET_MOBILE_OPEN_FALSE,
    SET_SIGNED,
    SET_UN_SIGNED,
    SET_ALERT_ON,
    SET_ALERT_OFF,
    SET_BACKDROP_ON,
    SET_BACKDROP_OFF,
    SET_LINEAR_ON,
    SET_LINEAR_OFF,
    SET_FILTER,
    RESET_FILTER,
    SET_PAY_VIEW,
    SET_CONFIG,
    PUSH_MY_PURCHASES,
    UPDATE_MY_PURCHASE,
    DELETE_MY_PURCHASE
} from '../types'
import store from '../store'
//import firebaseApp from '../../util/firebaseApp'
import { axiosApp } from '../../util/axiosApp'
import { AnyAction } from 'redux'
import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { PaysBillType } from '../../util/types'
import { getAuth, User, signOut } from 'firebase/auth'
import { collection, doc, getDoc, getDocs, getFirestore, limit, query, where } from 'firebase/firestore'
import firebaseApp from '../../util/firebaseApp'
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp);

export const getMyPurchases = (uid: string) => async (dispatch: any) => {
    const maxPages: number = +process.env.REACT_APP_MAX_PURCHASES!
    //const purchasesRef = firebaseApp.firestore().collection('pays_bill')
    const purchasesRef = collection(db, 'pays_bill')
    const q = query(purchasesRef, where('userId', '==', uid), limit(maxPages))
    const purchasesRes = await getDocs(q)

    if (purchasesRes.empty) {
        return
    } else {
        let arr: object[] = []
        purchasesRes.forEach(doc => {
            arr.push(doc.data());
        })
        dispatch({ type: PUSH_MY_PURCHASES, payload: arr })
    }
}

export const createBillQiwiPay = (data: PaysBillType) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON });
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)

    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'post',
        url: 'apiPay/createBillQiwiPay',
        data: data
    }).then((res) => {
        dispatch({ type: SET_BACKDROP_OFF });
        return window.location.assign(res.data.payUrl)
    })
        .catch((err) => {
            let answer
            if (err.response.data.message) {
                answer = err.response.data.message
            } else {
                answer = 'Ошибка /отправки/получения счета'
            }
            dispatch({ type: SET_ALERT_ON, payload: answer });
            dispatch({ type: SET_BACKDROP_OFF });
            console.log(err.response); // todo table form
        })
}

export const checkBillQiwiPay = (data: any) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON });
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)
    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'post',
        url: 'apiPay/checkBillQiwiPay',
        data: data
    }).then((res) => {
        console.log(res)
        dispatch({ type: UPDATE_MY_PURCHASE, payload: res.data.resData });
        dispatch({ type: SET_ALERT_ON, payload: res.data.message });
        dispatch({ type: SET_BACKDROP_OFF });
    })
        .catch((err) => {
            dispatch({ type: SET_ALERT_ON, payload: err.response && 'Ошибка проверки счета' });
            dispatch({ type: SET_BACKDROP_OFF });
            console.table(err.response); // todo table form
        })
}

export const deleteBillQiwiPay = (data: any) => async (dispatch: any) => {
    dispatch({ type: SET_BACKDROP_ON });
    const idToken = await auth.currentUser!.getIdToken(/* forceRefresh */ false)

    axiosApp({
        headers: { Authorization: `Bearer ${idToken} ` },
        method: 'delete',
        url: 'apiPay/deleteBillQiwiPay',
        data: data
    }).then((res) => {
        console.log(res)
        dispatch({ type: DELETE_MY_PURCHASE, payload: data.billId });
        dispatch({ type: SET_ALERT_ON, payload: "Данные удалены" });
        dispatch({ type: SET_BACKDROP_OFF });
    }).catch((err) => {
        dispatch({ type: SET_ALERT_ON, payload: 'Ошибка удаления объекта' });
        dispatch({ type: SET_BACKDROP_OFF });
        console.table(err.response); // todo table form
    })
}

// export const getPayNumber = (userId) => {   //for YooMoney method
//     const docPublicRef = firebaseApp.firestore().collection('users_public').doc(userId);
//     return docPublicRef.get()
//         .then((doc) => {
//             if (doc.exists) {
//                 return doc.data()
//             } else {
//                 return false
//                 // dispatch({ type: SET_ALERT_ON, payload: 'Объект не найден' });
//             }
//         }).catch((error) => {
//             console.log("Error getting document", error);
//             return false
//         });
// }

export const setFilter = (data: any) => (dispatch: any) => {
    dispatch({ type: SET_FILTER, payload: data })
    saveState('filter', store.getState().UI.filter)
}

export const resetFilter = () => (dispatch: any) => {
    dispatch({ type: RESET_FILTER })
    resetState('filter')
}

// export const payYoomoney2 = (data) => async (dispatch) => {   //К удалению
//     let idToken = await firebaseApp.auth().currentUser.getIdToken(/* forceRefresh */ true);

//     const form = new FormData();
//     form.append('userName', 'Fred');
//     axios({
//         // headers: { Authorization: `Bearer ${idToken} ` },
//         method: 'post',
//         url: 'https://yoomoney.ru/quickpay/confirm.xml',
//         data: form
//     }).then((res) => {
//         //dispatch({ type: UPDATE_PAY_ATRIBUTES_HOUSE, payload: res.data });
//         // dispatch({ type: SET_ALERT_ON, payload: res.data.message });
//         //  dispatch({ type: SET_BACKDROP_OFF });
//         console.log('payYoomoney res.data =>', res.data)
//     })
//         .catch((err) => {
//             //dispatch({ type: SET_ALERT_ON, payload: err.response });
//             //dispatch({ type: SET_BACKDROP_OFF });
//             console.table(err.response); // todo table form
//         })
// }

// export const payYoomoney = (event, userId) => async (dispatch) => {
//     dispatch({ type: SET_BACKDROP_ON })
//     const form = event.target.parentElement.parentElement;
//     const label = event.target.parentElement.parentElement.label.value;

//     if (label.split('_').length !== 3) {
//         dispatch({ type: SET_ALERT_ON, payload: 'Ошибка отправки данных' })
//         dispatch({ type: SET_BACKDROP_OFF })
//         return
//     }
//     //todp check pay url
//     axios({
//         method: 'post',
//         url: 'http://localhost:5000/test3-5c0fa/us-central1/api/user/secretWord',
//         data: { userId: userId }
//     }).then((res) => {
//         if (res.data.secretWord === true) {
//             console.log(res)
//             dispatch({ type: SET_BACKDROP_OFF });
//             form.submit();
//         } else {
//             dispatch({ type: SET_BACKDROP_OFF });
//             dispatch({ type: SET_ALERT_ON, payload: 'Продавец ненастроил секретное слово' });
//         }
//     }).catch((err) => {
//         dispatch({ type: SET_BACKDROP_OFF });
//         dispatch({ type: SET_ALERT_ON, payload: 'Ошибка проверки секретного слова' });
//         console.table(err); // todo table form
//     })
// }

export const getConfig = () => (dispatch: any) => {
    const docConfigRef = doc(db, 'utils', 'config')
    getDoc(docConfigRef)
        .then((doc) => {
            dispatch({ type: SET_CONFIG, payload: doc.data() })
        }).catch((error) => {
            dispatch({ type: SET_ALERT_ON, payload: 'Ошибка получения конфигурации' });
            console.log("Error getting config", error);
        });
}

export const setMobileOpenAC = () => ({
    type: SET_MOBILE_OPEN
})
export const setMobileOpenFalseAC = () => ({
    type: SET_MOBILE_OPEN_FALSE
})
export const isSignedInAC = (user: User) => ({
    type: SET_SIGNED,
    user
});
export const anonymousUserAC = () => ({
    type: SET_UN_SIGNED,
});

export const logOutCA = () => (dispatch: any) => {
    signOut(auth)
        .then(() => {
            dispatch({ type: SET_UN_SIGNED });
        })
        .catch((err) => {
            console.error(err);
        })
}
export const alertOffAC = () => ({
    type: SET_ALERT_OFF
})

export const setBackdropOnAC = () => ({
    type: SET_BACKDROP_ON
})
export const setBackdropOffAC = () => ({
    type: SET_BACKDROP_OFF
})
export const setLinearOnAC = () => ({
    type: SET_LINEAR_ON
})
export const setLinearOffAC = () => ({
    type: SET_LINEAR_OFF
})

// export const alertOffAC = () => ({
//     type: SET_ALERT_OFF
// })