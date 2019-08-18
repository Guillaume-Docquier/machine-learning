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
        const biasedInput = this.addBias(input);

        if (this.inputSize !== biasedInput.length) {
            console.log(`Incompatible input for feedforward operation. Expected ${this.inputSize}, actual: ${biasedInput.length}`);
            return utils.filledArray(this.outputSize, () => 0);
        }

        // z = w.i
        const output = utils.filledArray(this.outputSize, () => 0);
        for(let i = 0; i < this.inputSize; i++) {
            for(let j = 0; j < this.outputSize; j++) {
                output[j] += this.weights[i][j] * biasedInput[i]
            }
        }
        
        // a = g(z)
        return {
            input: biasedInput,
            output: this.activation.activate(output)
        };
    }

    backprop(previousErrors, input) {
        const derivatives = this.activation.transfer();
        const currentErrors = previousErrors.map((previousError, j) => previousError * derivatives[j]);

        const nextErrors = utils.filledArray(this.inputSize, () => 0);
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                nextErrors[i] += this.weights[i][j] * currentErrors[j];
            }
        }

        // This is a bit wierd but has a 3x performance increase over storing gradients in a input*output matrix
        const gradients = utils.filledArray(Math.max(this.inputSize, this.outputSize), () => ({}));
        for (let i = 0; i < this.inputSize; i++) {
            gradients[i].input = input[i];
        }
        
        for (let j = 0; j < this.outputSize; j++) {
            gradients[j].error = currentErrors[j];
        }

        return {
            errors: nextErrors,
            gradients
        };
    }

    updateWeights(learningRate, gradients) {
        // wij = wij - lr * gradij
        for (let i = 0; i < this.inputSize; i++) {
            for (let j = 0; j < this.outputSize; j++) {
                this.weights[i][j] += learningRate * gradients[i][j];
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