const utils = require("../utils.js");

const LAYER_TYPE = "Dense"

const DenseDeserializer = function(layerData, Deserializer) {
    if (layerData.type !== LAYER_TYPE) {
        return false;
    }

    const activation = Deserializer(layerData.activation);

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

    backPropagate(previousErrors) {
        const derivatives = this.activation.transfer();
        const currentErrors = previousErrors.map((previousError, j) => previousError * derivatives[j]);

        const nextErrors = utils.filledArray(this.inputSize, () => 0);
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                nextErrors[i] += this.weights[i][j] * currentErrors[j];
            }
        }

        this._setGradients(currentErrors);

        return nextErrors;
    }

    // This is a bit wierd but has a 3x performance increase over storing gradients in a input*output matrix
    _setGradients(errors) {
        this.gradients = utils.filledArray(Math.max(this.inputSize, this.outputSize), () => ({}));
        for (let i = 0; i < this.inputSize; i++) {
            this.gradients[i].input = this.input[i];
        }
        
        for (let j = 0; j < this.outputSize; j++) {
            this.gradients[j].error = errors[j];
        }
    }

    updateWeights(learningRate) {
        // wij = wij - lr * errorj * inputi
        for (let i = 0; i < this.inputSize; i++) {
            const input = this.gradients[i].input;
            for (let j = 0; j < this.outputSize; j++) {
                this.weights[i][j] += learningRate * input * this.gradients[j].error;
            }
        }
    }

    addBias(input) {
        return [...input, 1.0];
    }
}

module.exports = {
    Dense: (...args) => new Dense(...args),
    DenseDeserializer,
    DenseSerializer
}