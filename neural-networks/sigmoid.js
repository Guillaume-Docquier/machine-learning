const LAYER_TYPE = "Sigmoid"

const SigmoidFactory = function(layerData) {
    if (layerData.type !== LAYER_TYPE) {
        return false;
    }

    return new Sigmoid();
}

class Sigmoid {
    constructor() {
        this.type = LAYER_TYPE;
    }

    feedForward(input) {
        return input.map(value => 1 / (1 + Math.exp(-value)));
    }
}

module.exports = {
    Sigmoid: () => new Sigmoid(),
    SigmoidFactory
}