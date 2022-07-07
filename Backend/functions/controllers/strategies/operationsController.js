const firebaseAdmin = require("../firebaseAdmin");
const { firestoreDatabase, Timestamp } = firebaseAdmin;

const saveStrategy = async (data, uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) resolve({ success: false, message: "request input missing" });
      if (!uid) resolve({ success: false, message: "user id missing" });

      const strategiesCollectionRef =
        firestoreDatabase.collection("strategies");
      const strategies = await strategiesCollectionRef
        .where("user", "==", uid)
        .get();

      let total = 0;
      strategies.forEach((doc) => {
        total++;
      });
      if (total < 10) {
        await strategiesCollectionRef.doc().set({
          xml: data.xml ,
          name: data.name,
          isLive: data.isLive ,
          user: uid ,
          account: data.accountName ,
          accountName: data.accountName,
          created: Timestamp.now() ,
          performance: `${0.00}` ,
          strategy:data.strategy || `${""}`,
          timeframe: data.timeframe ,
          endsAt: 7 * 24 * 60 * 60 * 1000 ,
          exchange: data.exchange,
          key: `${data.key}` || `${""}`,
          secret: `${data.secret}` || `${""}`,
          passphrase: `${data.passphrase}` || `${""}`,
          orderAtMarketPrice: true , // 
          orderid: `${""}`,
          sl:`${0}` ,
          type: data.type ,
          side:`${""}`,
          paid: true ,
          trade : data.trade ,
          // symbol:data.asset.match(/.*(?=-)/)[0] ,
          // pair: data.asset,
          // asset: data.asset,
          // amount: Number(data.amount),
          marketType: data.marketType,
          paperTraderPerformance: data.paperTraderPerformance ,
          liveTraderPerformance: data.liveTraderPerformance,
          private:true,
          forSale:false,
          price:0
        });
        resolve({ success: true });
      } else {
        resolve({
          success: false,
          message: "maximum limit reached to save strategies",
        });
      }
    } catch (error) {
      console.log("error", error);
      resolve({ success: false, message: error.message });
    }
  });
};

const updateStrategy = async (data, uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) resolve({ success: false, message: "request input missing" });
      if (!uid) resolve({ success: false, message: "user id missing" });

      const strategiesCollectionRef =
        firestoreDatabase.collection("strategies");
      await strategiesCollectionRef.doc(data.strategyUid).update({ ...data });

      resolve({ success: true });
    } catch (error) {
      console.log("error", error);
      resolve({ success: false, message: error.message });
    }
  });
};

const getStrategies = async (uid) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!uid) resolve({ success: false, message: "user id missing" });

      const strategiesCollectionRef =
        firestoreDatabase.collection("strategies");
      const snapshot = await strategiesCollectionRef
        .orderBy("created", "desc")
        .where("user", "==", uid)
        .get();

      if (snapshot.empty) resolve({ success: true, data: [] });

      const strategies = [];
      snapshot.forEach((doc) => {
        strategies.push({ ...doc.data(), uid: doc.id });
      });

      resolve({ success: true, data: strategies });
    } catch (error) {
      resolve({ success: false, message: error.message });
    }
  });
};
const getTemplateStrategies = async () => {
  return new Promise(async (resolve, reject) => {
    try {

      const strategiesCollectionRef =
        firestoreDatabase.collection("strategy_templates");
      const snapshot = await strategiesCollectionRef
        .orderBy("created", "desc")
        .get();

      if (snapshot.empty) resolve({ success: true, data: [] });

      const strategies = [];
      snapshot.forEach((doc) => {
        strategies.push({ ...doc.data(), uid: doc.id });
      });

      resolve({ success: true, data: strategies });
    } catch (error) {
      resolve({ success: false, message: error.message });
    }
  });
};

module.exports = {
  saveStrategy,
  getStrategies,
  updateStrategy,
  getTemplateStrategies,
};
