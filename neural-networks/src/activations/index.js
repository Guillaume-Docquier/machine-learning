const { ReLU, ReLUDeserializer, ReLUSerializer } = require("./relu.js");
const { Sigmoid, SigmoidDeserializer, SigmoidSerializer } = require("./sigmoid.js");
const { Linear, LinearDeserializer, LinearSerializer } = require("./linear.js");

module.exports = {
    ReLU,
    Sigmoid,
    Linear,
    deserializers: [ReLUDeserializer, SigmoidDeserializer, LinearDeserializer],
    serializers: [ReLUSerializer, SigmoidSerializer, LinearSerializer]
}