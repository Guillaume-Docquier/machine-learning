const LAYER_TYPE = "ReLU"

const ReLUFactory = function(layerData) {
    if (layerData.type !== LAYER_TYPE) {
        return false;
    }

    return new ReLU();
}

class ReLU {
    constructor() {
        this.type = LAYER_TYPE;
    }

    feedForward(input) {
        return input.map(value => Math.max(0, value));
    }
}

module.exports = {
    ReLU: () => new ReLU(),
    ReLUFactory
}