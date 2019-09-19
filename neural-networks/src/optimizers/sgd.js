const utils = require("../utils");

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
        this.verbose = config.verbose || false;
    }

    step(data, model) {
        const startTime = new Date();
        for (let i = 0; i < data.length; i += this.batchSize) {
            const miniBatchLayerGradients = utils.generatorFilledArray(model.layers.length, (_, i) => ({
                inputs: utils.generatorFilledArray(model.layers[i].inputSize, () => []),
                errors: utils.generatorFilledArray(model.layers[i].outputSize, () => [])
            }));

            // Forward + backward for 1 batch
            const batch = data.slice(i, i + this.batchSize);
            for (let j = 0; j < batch.length; j++) {
                const datum = batch[j];
                const { inputs, output } = model.feedForward(datum.input);
                const errors = model.backprop(datum.output, output);

                for (let k = 0; k < miniBatchLayerGradients.length; k++) {
                    const miniBatchLayerGradientsK = miniBatchLayerGradients[k];
    
                    const input = inputs[k];
                    for (let l = 0; l < miniBatchLayerGradientsK.inputs.length; l++) {
                        miniBatchLayerGradientsK.inputs[l].push(input[l]);
                    }
                    
                    const error = errors[k];
                    for (let l = 0; l < miniBatchLayerGradientsK.errors.length; l++) {
                        miniBatchLayerGradientsK.errors[l].push(error[l]);
                    }
                }

                if (this.verbose) {
                    const avgIterationTime = (new Date() - startTime) / (i + j + 1);
                    utils.progress(`Iteration ${i + j + 1} of ${data.length}. Avg time per iteration: ${avgIterationTime.toFixed(3)}ms`);
                }
            }

            // Update with gradients
            model.update(this.learningRate / this.batchSize, miniBatchLayerGradients);
        }
    }
}

module.exports = {
    SGD: (...args) => new SGD(...args),
    SGDDeserializer,
    SGDSerializer
}