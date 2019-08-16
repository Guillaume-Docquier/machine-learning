const ACTIVATION_TYPE = "Sigmoid";

const SigmoidFactory = function(activationData) {
    if (activationData.type !== ACTIVATION_TYPE) {
        return false;
    }

    return new Sigmoid();
}

class Sigmoid {
    constructor() {
        this.type = ACTIVATION_TYPE;
        this.output = null;
    }

    activate(input) {
        this.output = input.map(value => 1 / (1 + Math.exp(-value)));

        return this.output;
    }

    transfer() {
        return this.output.map(output => output * (1 - output));
    }

    serialize() {
        const { type } = this;
        return {
            type
        };
    }
}

module.exports = {
    Sigmoid: () => new Sigmoid(),
    SigmoidFactory
}