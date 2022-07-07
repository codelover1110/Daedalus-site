const tradingController = require("./tradingController");

module.exports = {
  buy: tradingController.buy,
  sell: tradingController.sell,
  getSymbolQuote: tradingController.getSymbolQuote,
  calculateLatestPrice: tradingController.calculateLatestPrice,
};
