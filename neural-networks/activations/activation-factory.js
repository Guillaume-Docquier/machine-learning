const { ReLUFactory } = require("./relu.js");
const { SigmoidFactory } = require("./sigmoid.js");

const activationFactories = [
    ReLUFactory,
    SigmoidFactory
];

const ActivationFactory = function(activationData) {
    let activation = null;
    for (let i = 0; i < activationFactories.length && !activation; i++) {
        activation = activationFactories[i](activationData);
    }

    if (!activation) {
        console.log(`No factory could create a activation. Data: ${activationData}`);
    }

    return activation;
}

module.exports = {
    ActivationFactory
}