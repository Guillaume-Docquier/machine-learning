const { ReLU, ReLUDeserializer, ReLUSerializer } = require("./relu.js");
const { Sigmoid, SigmoidDeserializer, SigmoidSerializer } = require("./sigmoid.js");

module.exports = {
    ReLU,
    Sigmoid,
    deserializers: [ReLUDeserializer, SigmoidDeserializer],
    serializers: [ReLUSerializer, SigmoidSerializer]
}