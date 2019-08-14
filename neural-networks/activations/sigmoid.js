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
    }

    activate(input) {
        return input.map(value => 1 / (1 + Math.exp(-value)));
    }
}

module.exports = {
    Sigmoid: () => new Sigmoid(),
    SigmoidFactory
}