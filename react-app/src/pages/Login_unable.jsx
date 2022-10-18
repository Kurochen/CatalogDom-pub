
// // Import FirebaseAuth and firebase.
// import React from 'react';
// import firebase from 'firebase/app';
// //import 'firebase/auth';
// import firebaseApp from '../util/firebaseApp';
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// import { Typography } from '@material-ui/core';
// //import * as firebase from '../util/firebaseApp';

// //const firebaseApp = firebase.initializeApp(firebaseConfig);

// // Configure FirebaseUI.
// const uiConfig = {
//     // Popup signin flow rather than redirect flow.
//     signInFlow: 'popup',
//     // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
//     signInSuccessUrl: '/',
//     // We will display Google and Facebook as auth providers.
//     signInOptions: [
//         firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//         //firebase.auth.FacebookAuthProvider.PROVIDER_ID
//     ],
//     callbacks: {
//         signInSuccessWithAuthResult: function (authResult, redirectUrl) {
//             var user = authResult.user;
//             var credential = authResult.credential;
//             var isNewUser = authResult.additionalUserInfo.isNewUser;
//             var providerId = authResult.additionalUserInfo.providerId;
//             var operationType = authResult.operationType;
//             // Do something with the returned AuthResult.
//             // Return type determines whether we continue the redirect automatically
//             // or whether we leave that to developer to handle.

//             return true;
//         }
//     }
// };

// class SignInScreen extends React.Component {
//     // state = {
//     //     isSignedIn: undefined,
//     // };

//     // componentDidMount() {
//     //     this.unregisterAuthObserver2 = firebaseApp.auth().onAuthStateChanged((user) => {
//     //         this.setState({ isSignedIn: !!user });
//     //     });
//     // }

//     // /**
//     //  * @inheritDoc
//     //  */
//     // componentWillUnmount() {
//     //     this.unregisterAuthObserver2();
//     // }

//     render() {

//         return (
//             <div>
//                 <Typography component='h1' variant='h5' color="primary" gutterBottom>
//                     {'Регистрация / вход'}
//                 </Typography>

//                 <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />
//                 {/* 
//                 <div >
//                     <div >
//                         <i >photo</i> My App
//         </div>
//                     <div >This is a cool demo app</div>
//                     {this.state.isSignedIn !== undefined && !this.state.isSignedIn &&
//                         <div>
//                             <StyledFirebaseAuth uiConfig={this.uiConfig}
//                                 firebaseAuth={firebaseApp.auth()} />
//                         </div>
//                     }
//                     {this.state.isSignedIn &&
//                         <div>
//                             Hello {firebaseApp.auth().currentUser.displayName}. You are now signed In!
//             <a onClick={() => firebaseApp.auth().signOut()}>Sign-out</a>
//                         </div>
//                     }
//                 </div> */}

//             </div>


//         );
//     }
// }

// export default SignInScreen