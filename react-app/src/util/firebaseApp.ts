// //Firebase
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import "firebase/compat/analytics";
// import firebaseConfig from "./firebaseConfig"

// export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();



import firebaseConfig from "./firebaseConfig"

import { initializeApp } from "firebase/app"

//const firebaseApp = initializeApp(firebaseConfig);

export default initializeApp(firebaseConfig);
