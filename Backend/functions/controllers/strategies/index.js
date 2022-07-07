const operationsController = require("./operationsController");

module.exports = {
    saveStrategy: operationsController.saveStrategy,
    getStrategies: operationsController.getStrategies,
    updateStrategy: operationsController.updateStrategy,
    getTemplateStrategies: operationsController.getTemplateStrategies
};