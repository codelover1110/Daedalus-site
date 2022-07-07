// fire.js

import firebase from "firebase";
import "firebase/auth";
import Logger from "./helpers/logger";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = firebase.initializeApp({
  apiKey: "AIzaSyDkjnSLr2ZR9t74lztyWM7WS9IvF8VCQS0",
  authDomain: "daedalus-ecc1f.firebaseapp.com",
  projectId: "daedalus-ecc1f",
  storageBucket: "daedalus-ecc1f.appspot.com",
  messagingSenderId: "111586643997",
  appId: "1:111586643997:web:f03c0d0acaca6937caf6f4",
  measurementId: "G-F891Q3SX24",
});
const db = app.firestore();

export { db };

export function formatFireError(code) {
  switch (code) {
    case "auth/user-not-found":
      return "Email or password incorrect";
    case "auth/wrong-password":
      return "password incorrect";
    default:
      return "Error occured,please try again later.";
  }
}

export const auth = app.auth();

app.functions().useFunctionsEmulator('http://localhost:5000')
export default app;
