import app, {db} from "../firebase";
import firebase from "firebase/app"
import "firebase/auth"
import { authHeader } from "../store/_helpers/auth-header";
import { callService } from "./callableFunction";

export const userService = {
  login,
  logout,
  register,
};



//Checks if email is in beta_invites list
//Returns Promise
const helper = async (email) =>{
  async function callback (){
    let result = await db.collection("beta_invites")
    .get()
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      let x =0;
      let res =[]
      while (x<data.length){
       
        res.push(data[x].email);
        console.log(res[x]);
        x++;
      }
      if(res.length>0){
        let isInBetaList = res.indexOf(email) !== -1;
        console.log("IS IN BETA LIST", isInBetaList);
        return isInBetaList;
      }
     
    });
  }
  return callback();
 
}
export const emailInBetaList = async (email) => {
  const result = await helper(email)
  console.log(result);
  return result;

};

async function login(username, password) {
  return app
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function () {
      return app
        .auth()
        .signInWithEmailAndPassword(username, password)
        .then(async (user) => {
          let token  = await user.user.getIdToken();
          if (user) {
            // get user information
            // let userInfo = await getUserDataFromFirebase();
            let userDetails = setUser(user.user, token);
            localStorage.setItem("user", JSON.stringify(userDetails));
            return user.user;
          }
        });
    });
}

function setUser(user) {
  let userDetails = {
    email: user.email,
    displayName: user.displayName,
    uid: user.uid,
  };
  return userDetails;
}

function logout() {
  // remove user from local storage to log user out
  app
    .auth()
    .signOut()
    .then(function () {
      localStorage.removeItem("user");
    })
    .catch(function (error) {
      // An error happened.
    });
}

async function register(user) {
  const { email, firstName, lastName, password } = user;
  return app
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(async function () {
      return app
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          let currentUser = app.auth().currentUser;
          if (userCredential) {
            let displayName = `${firstName} ${lastName}`;
            currentUser.updateProfile({
              displayName: displayName,
            });
            let startingBalance= 100000;
            let paperStocks= {balance:startingBalance, type:"stock", positions:[], name:"Stock Paper Trading"};
            let paperCrypto= {balance:startingBalance, type:"crypto", positions:[], name:"Crypto Paper Trading"};
            let userDetails =  addUserDetails(userCredential.user, displayName);
            let userData = {
              firstname: firstName,
              lastname: lastName,
              lastAccessed: "",
              email: email,
              datejoined: new Date(),
              connectedAccounts: [paperStocks, paperCrypto],
              uid: userCredential.user.uid,
              admin: false,
              subscriptionTier:"free"
            };

            await userCredential.user.sendEmailVerification();
            await addUserInFirebase(userData);
            localStorage.setItem("user", JSON.stringify(userDetails));
            return userData;
          }
        });
    });
}

/**
 * file : file object
 * UserId: to make path to store Files.
 */
const uploadFile = (file, userId) => {
  let storageRef = app.storage().ref();
  let uploadTask = storageRef.child(`${userId}/images/` + file.name).put(file);
  uploadTask.on(
    app.storage.TaskEvent.STATE_CHANGED,
    (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case app.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case app.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          break;
        case "storage/canceled":
          break;
        case "storage/unknown":
          break;
      }
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
      });
    }
  );
};

const getAllFiles = (userId) => {
  let storageRef = app.storage().ref();
  let listRef = storageRef.child(`${userId}/images/`);
// Find all the prefixes and items.
listRef.listAll()
  .then((res) => {
    res.prefixes.forEach((folderRef) => {
      // All the prefixes under listRef.
      // You may call listAll() recursively on them.
    });
    res.items.forEach((itemRef) => {
      // All the items under listRef.
    });
  }).catch((error) => {
    // Uh-oh, an error occurred!
  });
}

const addUserInFirebase = async (data) => {
  return callService("addUser", data);
};

export const getUserDataFromFirebase = async () => {
  let result = await callService("getUser");
  console.log(result)
  return result;
}

function addUserDetails(user, displayName) {
  let userDetail = {
    email: user.email,
    displayName: displayName,
    uid: user.uid,
  };
  return userDetail;
}
