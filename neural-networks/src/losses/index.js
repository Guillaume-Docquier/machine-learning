const { MSE, MSEDeserializer, MSESerializer } = require("./mse.js");

module.exports = {
    MSE,
    deserializers: [MSEDeserializer],
    serializers: [MSESerializer]
}