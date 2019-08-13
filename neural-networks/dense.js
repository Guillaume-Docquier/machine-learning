const utils = require("./utils.js");

const LAYER_TYPE = "Dense"

const DenseFactory = function(layerData) {
    if (layerData.type !== LAYER_TYPE) {
        return false;
    }

    return new Dense(layerData.inputSize, layerData.outputSize, layerData.weights);
}

class Dense {
    constructor(inputSize, outputSize, weights) {
        this.type = LAYER_TYPE;
        this.inputSize = inputSize;
        this.outputSize = outputSize;

        if (weights) {
            if (weights.length !== inputSize || weights[0].length !== outputSize) {
                console.log(`Incompatible size for Dense layer with weights initialization. Expected ${inputSize}x${outputSize}, actual: ${weights.length}x${weights[0].length}`);
            }

            this.weights = weights
        }
        else {
            this.weights = utils.randomMatrixInitializer(inputSize, outputSize);
        }
    }

    feedForward(input) {
        if (input.length !== this.inputSize) {
            console.log(`Incompatible input for feedforward operation. Expected ${this.inputSize}, actual: ${input.length}`);
            return utils.filledArray(this.outputSize, 0);
        }

        // Y = E.i [ Ej [ x.i * w.ij ] ] in a non-matrix form
        const output = utils.filledArray(this.outputSize, 0);
        for(let i = 0; i < this.inputSize.length; i++) {
            for(let j = 0; j < this.outputSize; j++) {
                output[j] += input[i] * this.weights[i][j]
            }
        }
        
        return output;
    }
}

module.exports = {
    Dense: (inputSize, outputSize) => new Dense(inputSize, outputSize),
    DenseFactory,
}