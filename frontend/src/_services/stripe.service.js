import {callService} from "./callableFunction";

const getStripeConfig = async () => await callService("getStripeConfig");
const stripeCreateCheckoutSession = async (data) => await callService("stripeCreateCheckoutSession", data);
const stripeCancelSubscription = async () => await callService("stripeCancelSubscription");
export {
  getStripeConfig,
  stripeCreateCheckoutSession,
  stripeCancelSubscription
}
