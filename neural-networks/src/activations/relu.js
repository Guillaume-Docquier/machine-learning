const ACTIVATION_TYPE = "ReLU";

const ReLUDeserializer = function(activationData) {
    if (activationData.type !== ACTIVATION_TYPE) {
        return false;
    }

    return new ReLU();
};

const ReLUSerializer = function(activation) {
    if (activation.type !== ACTIVATION_TYPE) {
        return false;
    }

    const { type } = activation;
    return {
        type
    };
};

class ReLU {
    constructor() {
        this.type = ACTIVATION_TYPE;
        this.output = null;
    }

    activate(input) {
        this.output = input.map(value => Math.max(0, value));

        return this.output;
    }

    transfer() {
        return this.output.map(output => output > 0 ? 1 : 0);
    }
}

module.exports = {
    ReLU: () => new ReLU(),
    ReLUDeserializer,
    ReLUSerializer
}