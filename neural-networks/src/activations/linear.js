const ACTIVATION_TYPE = "Linear";

const LinearDeserializer = function(activationData) {
    if (activationData.type !== ACTIVATION_TYPE) {
        return false;
    }

    return new Linear();
}

const LinearSerializer = function(activation) {
    if (activation.type !== ACTIVATION_TYPE) {
        return false;
    }

    const { type } = activation;
    return {
        type
    };
}

class Linear {
    constructor() {
        this.type = ACTIVATION_TYPE;
        this.input = null;
    }

    activate(input) {
        this.input = [...input];

        return this.input;
    }

    transfer() {
        return this.input.map(_ => 1);
    }
}

module.exports = {
    Linear: () => new Linear(),
    LinearDeserializer,
    LinearSerializer
}