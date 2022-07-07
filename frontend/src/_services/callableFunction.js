import firebase from "../firebase";

export const callService = async (serviceName, params = {}) => {
  const callablefirebaseFunction = firebase
    .functions()
    .httpsCallable(serviceName);
  return callablefirebaseFunction(params);
};
