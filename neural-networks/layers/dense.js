const utils = require("../utils.js");

const LAYER_TYPE = "Dense"

const DenseFactory = function(layerData, Factory) {
    if (layerData.type !== LAYER_TYPE) {
        return false;
    }

    const activation = Factory(layerData.activation);

    return new Dense(layerData.inputSize, layerData.outputSize, activation, false, layerData.weights);
}

const DenseSerializer = function(layer, Serializer) {
    if (layer.type !== LAYER_TYPE) {
        return false;
    }

    const { type, inputSize, outputSize, activation, weights } = layer;
    return {
        type,
        inputSize,
        outputSize,
        activation: Serializer(activation),
        weights
    }
}

class Dense {
    constructor(inputSize, outputSize, activation, addBias = true, weights = null) {
        this.type = LAYER_TYPE;
        this.inputSize = inputSize + (addBias ? 1 : 0);
        this.outputSize = outputSize;
        this.activation = activation;
        this.input = null;

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
        // w = [w, b]
        this.input = this.addBias(input);

        if (this.inputSize !== this.input.length) {
            console.log(`Incompatible input for feedforward operation. Expected ${this.inputSize}, actual: ${this.input.length}`);
            return utils.filledArray(this.outputSize, () => 0);
        }

        // z = w.i
        const output = utils.filledArray(this.outputSize, () => 0);
        for(let i = 0; i < this.inputSize; i++) {
            for(let j = 0; j < this.outputSize; j++) {
                output[j] += this.weights[i][j] * this.input[i]
            }
        }
        
        // a = g(z)
        return this.activation.activate(output);
    }

    backPropagate(errors) {
        const derivatives = this.activation.transfer();
        this.errors = errors.map((error, j) => error * derivatives[j]);

        const nextErrors = utils.filledArray(this.inputSize, () => 0);
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                nextErrors[i] += this.weights[i][j] * this.errors[j];
            }
        }

        return nextErrors;
    }

    updateWeights(learningRate) {
        // wij = wij - lr * errorj * inputi
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weights[i][j] += learningRate * this.errors[j] * this.input[i];
            }
        }
    }

    addBias(input) {
        return [...input, 1.0];
    }
}

module.exports = {
    Dense: (...args) => new Dense(...args),
    DenseFactory,
    DenseSerializer
}