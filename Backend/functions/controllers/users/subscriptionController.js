const { firestoreDatabase } = require('../firebaseAdmin');
const config = require('../../config')
const stripe = require('stripe')(config.stripe_secret_key, {
  apiVersion: '2020-08-27'
});

const getStripeConfig = () => {
  return {
    publishableKey: config.stripe_secret_key,
    goldPrice: config.pricing_gold,
    silverPrice: config.pricing_silver,
    freePrice: config.pricing_free,
  }
}

const retrieveCheckoutSession = async (sessionId) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
}

const createCheckoutSession = async (priceId, userId) => {
  const domainURL = config.domain
  try {

    const usersRef = firestoreDatabase.collection("USERS");
    const docRef = await usersRef.doc(userId).get();
    let userData = docRef.data();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userData.email,
      // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
      success_url: `${domainURL}/SubscriptionSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/SubscriptionCanceled`,
      // automatic_tax: { enabled: true }
    });

    return {
      sessionUrl: session.url
    }
  } catch (e) {
    return {
      error: {
        message: e.message,
      }
    }
  }
}

const getCustomerPortal = async(sessionId) => {

  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = config.domain;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  return {
    portalUrl: portalSession
  }
}

const cancelSubscription = async (userId) => {
  const usersRef = firestoreDatabase.collection("USERS");
  const docRef = await usersRef.doc(userId).get();
  let userData = docRef.data();
  if(userData?.subscription?.subscriptionId){
    await stripe.subscriptions.del(userData.subscription.subscriptionId);
  }
  return {
    success: true
  }
}
const handleWebhookRequest = async(req, res) => {
  let dataObject;
  let eventType;
  // Check if webhook signing is configured.
  if (config.stripe_webhook_secret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        config.stripe_webhook_secret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    dataObject = event.data.object;
    eventType = event.type;
  }
  if (eventType === "checkout.session.completed") {
    stripe.checkout.sessions.listLineItems(
      dataObject.id,
      { limit: 5 },
      async(err, lineItems)=> {
        const items = lineItems['data'];
        if(!err && Array.isArray(items) && items.length>0) {

          const priceData = items[0]['price'];
          const priceId = priceData.id || ''
          const productId = priceData.product || ''
          const subscriptionId = dataObject.subscription || ''
          const subscriptionStatus = dataObject.status || ''
          const customerId = dataObject.customer || ''
          const expiresAt = dataObject.expires_at || ''
          const paymentStatus = dataObject.payment_status || ''
          const subscription = {
            priceId, productId, subscriptionId, subscriptionStatus, customerId, expiresAt, paymentStatus,
          }
          let subscriptionTier = 'free';
          switch (priceData.id) {
            case config.pricing_gold:
              subscriptionTier = 'gold';
              break;
            case config.pricing_silver:
              subscriptionTier = 'silver';
              break;
          }
          const batch = firestoreDatabase.batch();
          const snapshot = await firestoreDatabase.collection("USERS").where("email", "==", dataObject.customer_email).get();
          snapshot.forEach(doc => {
            batch.update(doc.ref, { subscription, subscriptionTier });
          });
          await batch.commit();
        }
      }
    );
  }
  if (eventType === "customer.subscription.deleted"){

    const batch = firestoreDatabase.batch();
    const snapshot = await firestoreDatabase.collection("USERS").where("subscription.subscriptionId", "==", dataObject.id).get();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { subscription : {}, subscriptionTier: 'free' });
    });
    await batch.commit();
  }
  return res.sendStatus(200);
}
module.exports = {
  getStripeConfig,
  retrieveCheckoutSession,
  createCheckoutSession,
  getCustomerPortal,
  cancelSubscription,
  handleWebhookRequest
}
