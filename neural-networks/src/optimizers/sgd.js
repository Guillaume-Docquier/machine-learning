const utils = require("../utils.js");

const OPTIMIZER_TYPE = "SGD";

const SGDDeserializer = function(optimizerData) {
    if (optimizerData.type !== OPTIMIZER_TYPE) {
        return false;
    }

    const { learningRate, batchSize } = optimizerData;
    return new SGD({ learningRate, batchSize });
};

const SGDSerializer = function(optimizer) {
    if(optimizer.type !== OPTIMIZER_TYPE) {
        return false;
    }

    const { type, learningRate, batchSize } = optimizer;
    return {
        type,
        learningRate,
        batchSize
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
        for (let i = 0; i < data.length; i += this.batchSize) {
            const miniBatchLayerGradients = utils.generatorFilledArray(model.layers.length, (_, i) => ({
                inputs: utils.generatorFilledArray(model.layers[i].inputSize, () => []),
                errors: utils.generatorFilledArray(model.layers[i].outputSize, () => []),
                batchSize: this.batchSize
            }));

            // Forward + backward for 1 batch
            for (let j = 0; j < this.batchSize && j + i < data.length; j++) {
                const { inputs, output } = model.feedForward(data[i + j].input);
                const gradients = model.backprop(data[i + j].output, output);

                gradients.reverse();
                for (let k = 0; k < gradients.length; k++) {
                    const miniBatchLayerGradientsK = miniBatchLayerGradients[k];
    
                    const input = inputs[k];
                    for (let l = 0; l < input.length; l++) {
                        miniBatchLayerGradientsK.inputs[l].push(input[l]);
                    }
                    
                    const gradErrors = gradients[k];
                    for (let l = 0; l < gradErrors.length; l++) {
                        miniBatchLayerGradientsK.errors[l].push(gradErrors[l]);
                    }
                }

                const avgIterationTime = (new Date() - startTime) / (i + j + 1);
                utils.progress(`Iteration ${i + j + 1} of ${data.length}. Avg time per iteration: ${avgIterationTime.toFixed(3)}ms`);
            }

            // Update with gradients
            model.update(miniBatchLayerGradients);
        }
    }
}

module.exports = {
    SGD: (...args) => new SGD(...args),
    SGDDeserializer,
    SGDSerializer
}