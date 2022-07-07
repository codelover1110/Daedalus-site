import firebase from "firebase/app";
import "firebase/auth";

export const updateObject = (oldObject, updatedProperties) => {
	return {
		...oldObject,
		...updatedProperties,
	};
};

export function writeUserData(user) {
	let uid = makeid(10)
	// firebase.database().ref('users/' + uid).set({
	//   ...user,
	//   uniqueId : uid
	// }).then((res)=> console.log(res))
	// .catch((err)=>{
	// 	console.log("ERROR INDATABASE")
	// 	console.error(err)
	// })
  }

  function makeid(length) {
	  var result           = '';
	  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	  result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}