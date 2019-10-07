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
        this.input = null;
    }

    activate(input) {
        this.input = [...input];

        //console.log(this.input);
        //console.log(this.input.map(z => Math.max(0, z)));
        return this.input.map(z => Math.max(0, z));
    }

    transfer() {
        return this.input.map(z => z > 0 ? 1 : 0);
    }
}

module.exports = {
    ReLU: () => new ReLU(),
    ReLUDeserializer,
    ReLUSerializer
}