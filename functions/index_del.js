const functions = require("firebase-functions");
const express = require("express");
const verifyToken = require("./util/verifyToken");
const cors = require("cors");


// const whitelist = ['https://catalogdom.web.app', 'https://catalogdom.firebaseapp.com']
// let corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }


const {
  editPayAtributes,
  editMaterialAtributes,
  editMainAtributes,
  addNewHouse,
  uploadImage,
  generateThubnail,
  imageDelete,
  deleteHouse,
} = require("./handlers/houses");

const {
  setUserPublicProfile,
  setUserPrivateProfile,
  secretWord,
} = require("./handlers/users");

const {
  createBillQiwiPay,
  checkBillQiwiPay,
  deleteBillQiwiPay,
} = require("./handlers/pay");

const {
  pageNotFound,
  siteMapCreate,
  turboYML
} = require("./handlers/util")

const app = express();
const pay = express();
const util = express();
app.use(cors());
pay.use(cors());
util.use(cors());


app.post("/house/addNewHouse", verifyToken, addNewHouse);
app.put("/house/editMainAtributes", verifyToken, editMainAtributes);
app.put("/house/editMaterial", verifyToken, editMaterialAtributes);
app.put("/house/editPay", verifyToken, editPayAtributes);
app.delete("/house/imageDelete", verifyToken, imageDelete);
app.delete("/house/deleteHouse", verifyToken, deleteHouse);

pay.post("/createBillQiwiPay", verifyToken, createBillQiwiPay);
pay.post("/checkBillQiwiPay", verifyToken, checkBillQiwiPay);
pay.delete("/deleteBillQiwiPay", verifyToken, deleteBillQiwiPay);


// app.post('/house', postNewHouse);  //Route conflict
// app.post('/image', imageTest);
app.post("/imageUpload", verifyToken, uploadImage);

app.put("/user/setUserProfile", verifyToken, setUserPublicProfile);
app.put("/user/setUserPrivateProfile", verifyToken, setUserPrivateProfile);
//app.post("/user/secretWord", secretWord);

util.get("/404", pageNotFound)
util.get("/sitemap", siteMapCreate)
util.get("/turboYML", turboYML)

const runtimeOpts = {
  timeoutSeconds: 30,
  memory: "256MB",
};

exports.generateThubnail = generateThubnail;

exports.api = functions
  .region('europe-west2')
  .runWith(runtimeOpts)
  .https
  .onRequest(app);

exports.apiPay = functions
  .region('europe-west2')
  .runWith(runtimeOpts)
  .https
  .onRequest(pay);

exports.apiUtil = functions
  .region('us-central1')
  .runWith(runtimeOpts)
  .https
  .onRequest(util);

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

//firebase deploy --only functions:api