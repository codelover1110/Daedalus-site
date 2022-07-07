const authController = require('./authController');
const accountController = require('./accountController');

const apiRouter = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            switch (data.router) {
                case '/getAccount':
                    result = await accountController.getAccounts(data);
                    break;
                case '/getPositions':
                    result = await accountController.getPositions(data);
                    break;
                case '/closePosition':
                    result = await accountController.closePosition(data);
                    break;
                case '/getOrders':
                    result = await accountController.getOrders(data);
                    break;
                case '/orderLimitBuy':
                    result = await accountController.orderLimitBuy(data);
                    break;
                case '/orderLimitSell':
                    result = await accountController.orderLimitSell(data);
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
    getAlpacaAuthToken: authController.getAlpacaAuthToken,
    getAlpacaRefershToken: authController.getAlpacaRefershToken,
    apiRouter
}
