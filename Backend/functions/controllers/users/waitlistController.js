const firebaseAdmin = require("../firebaseAdmin");
const {firestoreDatabase, Timestamp} = firebaseAdmin;
const sgMail = require('@sendgrid/mail')
const config = require('../../config')
sgMail.setApiKey(config.sendgrid_api_key)

const addToWaitList = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (email) {
        const waitListsRef = firestoreDatabase.collection("wait_lists");
        const waitLists = await waitListsRef
          .where("email", "==", email)
          .get();
        if (waitLists.docs.length > 0) {
          if (waitLists.docs[0].isSentEmail) {
            return reject({success: false, message: "Email already sent."});
          }
          return reject({success: false, message: "Email already registered."});
        }
        await waitListsRef.doc().set({
          email: email,
          added_at: Timestamp.fromDate(new Date()),
          isSentEmail: false,
          isFailedToSend: false
        })
        return resolve({success: true, message: `You've been added to the Daedalus waitlist!`});
      } else {
        return reject({success: false, message: "Email missing."});
      }
    } catch (error) {
      return reject({success: false, message: error.message});
    }
  });
}
const addToBetaInvites = async (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (email) {
        const betaListRef = firestoreDatabase.collection("beta_invites");
        const betaList = await betaListRef
          .where("email", "==", email)
          .get();
        if (betaList.docs.length > 0) {
          return reject({success: false, message: "Email already registered."});
        }
        await waitListsRef.doc().set({
          email: email,
          added_at: Timestamp.fromDate(new Date()),
        })
        return resolve({success: true, message: `User can sign up!`});
      } else {
        return reject({success: false, message: "Email missing."});
      }
    } catch (error) {
      return reject({success: false, message: error.message});
    }
  });
}

const sendWaitListEmail = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const waitListsRef = firestoreDatabase.collection("wait_lists");

      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      fromDate.setHours(0);
      fromDate.setMinutes(0);
      fromDate.setSeconds(0);

      const toDate = new Date();
      toDate.setMonth(toDate.getMonth() - 1);
      toDate.setDate(toDate.getDate() + 1);
      toDate.setHours(0);
      toDate.setMinutes(0);
      toDate.setSeconds(0);

      const failedToSendInvites = await waitListsRef
        .where("isFailedToSend", "==", true)
        .get();
      const remainingToSendInvites = await waitListsRef
        .where("isSentEmail", "==", false)
        .where('added_at', '>=', fromDate)
        .where('added_at', '<', toDate)
        .get();
      const waitLists = [...failedToSendInvites.docs, ...remainingToSendInvites.docs]
      for (let invite of waitLists) {
        const data = invite.data()
        await addToBetaInvites(data.email);
        await sendEmail(data.email)
          .then(async ()=>{
            await waitListsRef.doc(invite.id).update({
              isSentEmail: true,
              isFailedToSend: false
            })
          }).catch(async ()=>{
            await waitListsRef.doc(invite.id).update({
              isSentEmail: false,
              isFailedToSend: true
            })
          })
      }
      return resolve({success: true, message: 'Successfully processed.'});
    } catch (error) {
      return reject({success: false, message: error.message});
    }
  });
}
//Accesses beta_invites collection in firestore and returns all documents
const returnBetaEmails = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const betaListRef = firestoreDatabase.collection("beta_invites");
      const betaList = await betaListRef.get();
      const emails = betaList.docs.map(doc => doc.data().email);
      return resolve({success: true, emails: emails});
    } catch (error) {
      return reject({success: false, message: error.message});
    }
  });
}

const sendEmail = async (email) => {
  const msg = {
    to: email, // Change to your recipient
    from: 'noreply@daedalustech.io', // Change to your verified sender
    subject: 'Your Daedalus Beta Tester Status',
    html: `
        <p>Congratulations! You have been selected as a Daedalus Beta Tester and have been accepted off the waitlist. Please visit https://app.daedalustech.io to create your account.</p>
        <br />
        <p>Thank you,</p>
        <p>Your Daedalus Team</p>
    `,
  }
  return await sgMail.send(msg)
}

module.exports = {
  addToWaitList,
  sendWaitListEmail,
  addToBetaInvites,
  returnBetaEmails,
}
