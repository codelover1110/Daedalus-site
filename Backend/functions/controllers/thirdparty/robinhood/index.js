const authController = require('./authController');
const accountController = require('./accountController');

const apiRouter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            switch (data.basePath) {
                case '/accounts':
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
    getRobinhoodAuthToken: authController.getRobinhoodAuthToken,
    getRobinhoodRefershToken: authController.getRobinhoodRefershToken,
    apiRouter
}