const utils = require("./utils.js");

const LAYER_TYPE = "Dense"

const DenseFactory = function(layerData) {
    if (layerData.type !== LAYER_TYPE) {
        return false;
    }

    return new Dense(layerData.inputSize, layerData.outputSize, layerData.weights, false);
}

class Dense {
    constructor(inputSize, outputSize, weights, addBias = true) {
        this.type = LAYER_TYPE;
        this.inputSize = inputSize + (addBias ? 1 : 0);
        this.outputSize = outputSize;

        if (weights) {
            if (weights.length !== this.inputSize || weights[0].length !== this.outputSize) {
                console.log(`Incompatible size for Dense layer with weights initialization. Expected ${this.inputSize}x${this.outputSize}, actual: ${weights.length}x${weights[0].length}`);
            }

            this.weights = weights
        }
        else {
            this.weights = utils.randomMatrixInitializer(this.inputSize, this.outputSize);
        }
    }

    feedForward(input) {
        const biasedInput = this.addBias(input);

        if (biasedInput.length !== this.inputSize) {
            console.log(`Incompatible input for feedforward operation. Expected ${this.inputSize}, actual: ${biasedInput.length}`);
            return utils.filledArray(this.outputSize, () => 0);
        }

        // Y = E.i [ Ej [ x.i * w.ij ] ] in a non-matrix form
        const output = utils.filledArray(this.outputSize, () => 0);
        for(let i = 0; i < this.inputSize; i++) {
            for(let j = 0; j < this.outputSize; j++) {
                output[j] += biasedInput[i] * this.weights[i][j]
            }
        }
        
        return output;
    }

    addBias(input) {
        return [...input, 1.0];
    }
}

module.exports = {
    Dense: (inputSize, outputSize) => new Dense(inputSize, outputSize),
    DenseFactory,
}