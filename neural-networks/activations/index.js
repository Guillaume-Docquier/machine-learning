const { ReLU, ReLUFactory, ReLUSerializer } = require("./relu.js");
const { Sigmoid, SigmoidFactory, SigmoidSerializer } = require("./sigmoid.js");

module.exports = {
    ReLU,
    Sigmoid,
    factories: [ReLUFactory, SigmoidFactory],
    serializers: [ReLUSerializer, SigmoidSerializer]
}