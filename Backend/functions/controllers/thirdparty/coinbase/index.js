const authController = require('./authController');
const accountController = require('./accountController');

const apiRouter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            console.log("route", data.router);
            switch (data.router) {
                case '/getAccount':
                    result = await accountController.getAccounts(data);
                    break;
                default:
                    result = { status: false, message: 'Not fount path' };
                    break;
            }
            resolve(result)
        } catch (err) {
            resolve({ status: false, err: err.message });
        }
    });
}

module.exports = {
    getCoinbaseAuthToken: authController.getCoinbaseAuthToken,
    getCoinbaseRefershToken: authController.getCoinbaseRefershToken,
    apiRouter
}