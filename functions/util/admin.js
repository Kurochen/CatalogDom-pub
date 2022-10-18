const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://catalogdom.firebaseio.com",
    storageBucket: "catalogdom.appspot.com",
  }
);

const db = admin.firestore();


module.exports = { admin, db };
