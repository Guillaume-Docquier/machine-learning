const { SGD, SGDFactory, SGDSerializer } = require("./sgd.js");

module.exports = {
    SGD,
    factories: [SGDFactory],
    serializers: [SGDSerializer]
}