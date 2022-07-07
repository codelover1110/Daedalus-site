const isLoggedIn = (state) => state.authentication.loggedIn && state.authentication.user

const getUserDetails = (state) => state.authentication.user

const hasConnectedAccounts = (state) => {
  const user = getUserDetails(state);
  if (isLoggedIn(state)) return Array.isArray(user?.connectedAccounts) && user.connectedAccounts.length > 0;
  return false;
}

export {
  isLoggedIn,
  getUserDetails,
  hasConnectedAccounts,
}
