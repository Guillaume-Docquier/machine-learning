const ACTIVATION_TYPE = "Sigmoid";

const SigmoidDeserializer = function(activationData) {
    if (activationData.type !== ACTIVATION_TYPE) {
        return false;
    }

    return new Sigmoid();
}

const SigmoidSerializer = function(activation) {
    if (activation.type !== ACTIVATION_TYPE) {
        return false;
    }

    const { type } = activation;
    return {
        type
    };
}

class Sigmoid {
    constructor() {
        this.type = ACTIVATION_TYPE;
        this.output = null;
    }

    activate(input) {
        this.output = input.map(z => 1 / (1 + Math.exp(-z)));

        return this.output;
    }

    transfer() {
        return this.output.map(output => output * (1 - output));
    }
}

module.exports = {
    Sigmoid: () => new Sigmoid(),
    SigmoidDeserializer,
    SigmoidSerializer
}