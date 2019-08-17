const OPTIMIZER_TYPE = "SGD";

const SGDFactory = function(optimizerData) {
    if (optimizerData.type !== OPTIMIZER_TYPE) {
        return false;
    }

    return new SGD({ learningRate: optimizerData.learningRate });
};

const SGDSerializer = function(optimizer) {
    if(optimizer.type !== OPTIMIZER_TYPE) {
        return false;
    }

    const { type, learningRate } = optimizer;
    return {
        type,
        learningRate
    };
}

class SGD {
    constructor(config = {}) {
        this.type = OPTIMIZER_TYPE;
        this.learningRate = config.learningRate || 0.01;
    }
}

module.exports = {
    SGD: (...args) => new SGD(...args),
    SGDFactory,
    SGDSerializer
}