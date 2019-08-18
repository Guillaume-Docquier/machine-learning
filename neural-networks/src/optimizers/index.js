const { SGD, SGDDeserializer, SGDSerializer } = require("./sgd.js");

module.exports = {
    SGD,
    deserializers: [SGDDeserializer],
    serializers: [SGDSerializer]
}