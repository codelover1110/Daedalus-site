import app from "../../firebase"

export default class Firebase {
  constructor() {
    // Initialize Firebase
    this.db = app.firestore();
    this.auth = app.auth();
    this.storage = app.storage();
    this.users = this.db.collection('USERS')
   // this.provider = new app.auth.GoogleAuthProvider();
  }
  async isUser (){
    try {
      let user = await this.auth.currentUser
      return user
    } catch (e){
      return e
    }
  }

  async useGoogle (){
    try{
      console.log('a')
      let provider = new app.auth.GoogleAuthProvider()
      console.log(provider)
      const res = await this.auth.signInWithPopup(provider).then(function(result){
        console.log('a')
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user)
        return user
      })
      return res
    } catch(e){
      return e
    }
    
  }
  async findby(a, b, c){
    try {
      let name = await this.db.collection('users').where(a, b, c).get().then(d=>{
        if(d.docs[0] === undefined){
          return 'empty'
        }
        return d.docs[0].id//.data()[d]
      })
      return name
    } catch(e){
      return e
    }   
  }
  async findUsername(username){
    try {
      let name = await this.db.collection('users').where('username', '==', username).get().then(d=>{
        if(d.docs[0] === undefined){
          return 'empty'
        } else 
        return d.docs[0].data().username
      })
      return name
    } catch(e){
      return e
    }   
  }
  async findUser(uid){
    try {
      let id = await this.db.collection('USERS').doc(uid).get().then(d=>{
        // if(d === undefined){
        //   return 'empty'
        // }
        return d.data()
      })
      return id
    } catch(e){
      return e
    }   
  }
  async saveStrategy(data){
    try{
      let savingStrategy = await this.db.collection("strategies").add(data).then(res=> "done")
      return savingStrategy
    }catch(e){
      return e
    }
  }
  async findUserData(email){
    try {
      let id = await this.db.collection('users').where('email', '==', email).get().then(d=>{
        if(d.docs[0] === undefined){
          return 'empty'
        }
        return d.docs[0].data()
      })
      return id
    } catch(e){
      return e
    }   
  }

  async getProp (id, prop){
    try {
      let payments = await this.db.collection('users').doc(id).get().then(data=>{
        return data.data()[prop]
      })
      return payments
    } catch (e){
      return e
    }
   
  }

  async updateUser(id,data){
    try{
      let added = await this.db.collection('USERS').doc(id).update(data).then(d=> 'done') 
      return added
    } catch(e){
      return e
    }
  }
  async addNew (obj){
    try{
      let added = await this.db.collection('users').add(obj).then(d=> 'done') 
      return added
    } catch(e){
      return e
    }
  }
  async getCurrentUser(uid) {
    const userRef = await this.db.collection('users').doc(uid);
    const userSnapshot = await userRef.get();
    if (userSnapshot.exists) {
      return userSnapshot.data();
    }
  }

  async loginUser(email, password) {
    try {
      const res = await this.auth.signInWithEmailAndPassword(email, password);
      console.log(res)
      return res;
    } catch (error) {
      console.log(error)
      return;
    }
  }

//   async signUp (username, email, password, referredBy= '') {
//     try {
//         const res = await this.auth.createUserWithEmailAndPassword(email, password)
//         const user = await this.auth.currentUser
//         user.updateProfile({
//             displayName: username,
//         })
//         user.sendEmailVerification().then(function(){
          
//             alert('Verification Email has been sent to mail')
//         })
//         await this.users.add({username: username, email:email, password:password, referredBy:referredBy, referralid:shortid.generate(), stones:2, paidReferrer: false, referrals:[], payments: [], Date: new Date().toDateString()})
//         return res;
//     } catch (err){
//         return err
//     }
//   }

//   async changePassword(email){
//       try {
//           const authentication = await this.auth
//           authentication.sendPasswordResetEmail(email).then(function(){
//               swal(`Password reset instruction has been sent to ${email}`)
//           })
//       } catch (e){
//           return e
//       }
//   }

//   async updatePassword (password){
//     try {
//       let user = await this.auth.currentUser
//       console.log(user)
//       return user.updatePassword(password).then(function(){
//         return 'done'
//       })
//     } catch(e){
//       return e
//     }
//   }

  async logoutUser() {
    try {
      await this.auth.signOut()
    } catch (error) {
      console.log(error)
    }
    return;
  }
  async findTrader(email){
    try {
      let traders = await this.db.collection('traders').where('email', '==', email).get().then(d=>{
     
        return d.docs
      })
      return traders
    } catch(e){
      return e
    }   
  }
  async updateTrade(id, prop, data){
    try{
      let added = await this.db.collection('traders').doc(id).update({[prop]: data}).then(d=> 'done') 
      return added
    } catch(e){
      alert("An error occurred")
      return e
    }
  }
}

export const fb = new Firebase();
