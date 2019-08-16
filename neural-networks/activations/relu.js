const ACTIVATION_TYPE = "ReLU";

const ReLUFactory = function(activationData) {
    if (activationData.type !== ACTIVATION_TYPE) {
        return false;
    }

    return new ReLU();
}

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

    serialize() {
        const { type } = this;
        return {
            type
        };
    }
}

module.exports = {
    ReLU: () => new ReLU(),
    ReLUFactory
}