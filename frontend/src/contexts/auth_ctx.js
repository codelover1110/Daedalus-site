import React, {useContext, useState, useEffect, useRef} from "react";
import { auth } from "../firebase";
import Logger from "../helpers/logger";
import firebase from "firebase/app";
import {useDispatch} from "react-redux";
import {userActions} from "../store/_actions";
const AuthContext = React.createContext();

const db = firebase.firestore();
export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const snapshotUnsubscribeRef = useRef()
  const dispatch = useDispatch()
  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
      .then(async (user) => {
        if (user) {
          const userDetails = await db
            .collection("USERS")
            .doc(user.user.uid)
            .get();
          return userDetails.data();
        }
      });
  }

  async function login(email, password) {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then(async (user) => {
        if (user) {
          const userDetails = await db
            .collection("USERS")
            .doc(user.user.uid)
            .get();
          return userDetails.data();
        }
      });
  }

  async function logout() {
    await auth.signOut();
    localStorage.clear();
  }
  useEffect(
    () =>{
      const unsubscribe = auth.onAuthStateChanged(async(user) => {
        Logger.info("onAuthStateChanged", "[AuthProvider]");
        if(user) {
          snapshotUnsubscribeRef.current = await db
            .collection("USERS")
            .doc(user.uid)
            .onSnapshot(snapshot => {
              dispatch(userActions.loginSuccess(snapshot.data()))
            })
        }
        setCurrentUser(user);
        setLoading(false);
      });
      return () => {
        snapshotUnsubscribeRef.current?.();
        unsubscribe()
      }
    },
    []
  ); // <- don't rerun
  const value = {
    currentUser,
    signup,
    loading,
    setLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
