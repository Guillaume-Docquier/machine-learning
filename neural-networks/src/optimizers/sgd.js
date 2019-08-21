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
        for(let i = 0; i < data.length; i += this.batchSize) {
            const miniBatchLayerGradients = utils.generatorFilledArray(model.layers.length, (_, i) => ({
                inputs: utils.generatorFilledArray(model.layers[i].inputSize, () => []),
                errors: utils.generatorFilledArray(model.layers[i].outputSize, () => []),
                batchSize: this.batchSize
            }));

            // Forward + backward for 1 batch
            for(let j = 0; j < this.batchSize && j + i < data.length; j++) {
                const avgIterationTime = (new Date() - startTime) / (i + j + 1);
                utils.progress(`Iteration ${i + j + 1} of ${data.length}. Avg time per iteration: ${avgIterationTime.toFixed(3)}ms`);
                //console.log(`Iteration ${i + j + 1} of ${data.length}. Avg time per iteration: ${avgIterationTime.toFixed(3)}ms`);

                const { inputs, output } = model.feedForward(data[i + j].input);
                const gradients = model.backprop(data[i + j].output, output, inputs);

                gradients.reverse();
                for (let k = 0; k < gradients.length; k++) {
                    //console.log("gk", gradients[k].length);
                    //console.log("gk0", gradients[k][0].length);
                    //console.log("gk1", gradients[k][1].length);
                    //console.log("gi", miniBatchLayerGradients[0].inputs.length);
                    //console.log("ge", miniBatchLayerGradients[0].errors.length);
                    //console.log("gi0", miniBatchLayerGradients[0].inputs[0].length);
                    //console.log("ge0", miniBatchLayerGradients[0].errors[0].length);
                    
                    const gradInputs = gradients[k][0];
                    for (let l = 0; l < gradInputs.length; l++) {
                        miniBatchLayerGradients[k].inputs[l].push(gradInputs[l]);
                    }
                    
                    const gradErrors = gradients[k][1];
                    for (let l = 0; l < gradErrors.length; l++) {
                        miniBatchLayerGradients[k].errors[l].push(gradErrors[l]);
                    }
                }
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