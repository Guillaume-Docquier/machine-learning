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
    }

    activate(input) {
        return input.map(value => Math.max(0, value));
    }
}

module.exports = {
    ReLU: () => new ReLU(),
    ReLUFactory
}