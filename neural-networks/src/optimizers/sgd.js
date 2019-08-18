const utils = require("../utils.js");

const OPTIMIZER_TYPE = "SGD";

const SGDDeserializer = function(optimizerData) {
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
        this.batchSize = config.batchSize || 32;
    }

    step(data, model) {
        const startTime = new Date();
        for(let i = 0; i < data.length; i += this.batchSize) {
            const miniBatchGradients = [];
            // Forward + backward for 1 batch
            for(let j = 0; j < this.batchSize && j + i < data.length; j++) {
                const avgIterationTime = (new Date() - startTime) / (i + j + 1);
                utils.progress(`Iteration ${i + j + 1} of ${data.length}. Avg time per iteration: ${avgIterationTime.toFixed(3)}ms`);

                const { inputs, output } = model.feedForward(data[i + j].input);
                const gradients = model.backprop(data[i + j].output, output, inputs);
                miniBatchGradients.push(gradients.reverse());
            }

            // Generate gradients
            const nbLayers = miniBatchGradients[0].length;
            const layerGrads = utils.filledArray(nbLayers, () => 0);
            for (let i = 0; i < layerGrads.length; i++) {
                const inputSize = miniBatchGradients[0][i].filter(layerGrad => !isNaN(layerGrad.input)).length;
                const outputSize = miniBatchGradients[0][i].filter(layerGrad => !isNaN(layerGrad.error)).length;
                layerGrads[i] = utils.filledArray(inputSize, () => utils.filledArray(outputSize, () => 0));
            }

            for (let i = 0; i < miniBatchGradients.length; i++) {
                const sampleGradient = miniBatchGradients[i];
                for (let j = 0; j < sampleGradient.length; j++) {
                    const layerGradient = sampleGradient[j];
                    for (let k = 0; k < layerGradient.length; k++) {
                        for (let l = 0; l < layerGradient.length; l++) {
                            if (layerGradient[k].input && layerGradient[l].error) {
                                layerGrads[j][k][l] += layerGradient[k].input * layerGradient[l].error / this.batchSize;
                            }
                        }
                    }
                }
            }

            // Update with gradients
            model.update(layerGrads);
        }
    }
}

module.exports = {
    SGD: (...args) => new SGD(...args),
    SGDDeserializer,
    SGDSerializer
}