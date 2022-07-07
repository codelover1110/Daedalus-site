const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const app = initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://daedalus-ecc1f-default-rtdb.firebaseio.com",
});
const firestoreDatabase = getFirestore(app);

module.exports = {
  firestoreDatabase,
  Timestamp,
};
