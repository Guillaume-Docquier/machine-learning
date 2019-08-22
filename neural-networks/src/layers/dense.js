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
            return utils.valueFilledArray(this.outputSize, 0);
        }

        // z = w.i
        const output = utils.valueFilledArray(this.outputSize, 0);
        for (let i = 0; i < this.inputSize; i++) {
            const weightI = this.weights[i];
            const biasedInputI = biasedInput[i];
            for (let j = 0; j < this.outputSize; j++) {
                output[j] += weightI[j] * biasedInputI
            }
        }
        
        // a = g(z)
        return {
            input: biasedInput,
            output: this.activation.activate(output)
        };
    }

    backprop(previousErrors) {
        const derivatives = this.activation.transfer();
        const currentErrors = previousErrors.map((previousError, j) => previousError * derivatives[j]);

        const nextErrors = utils.valueFilledArray(this.inputSize, 0);
        for (let i = 0; i < this.inputSize; i++) {
            const weightI = this.weights[i];
            let nextErrorsI = nextErrors[i];
            for (let j = 0; j < this.outputSize; j++) {
                nextErrorsI += weightI[j] * currentErrors[j];
            }
            nextErrors[i] = nextErrorsI;
        }

        // Returning just the errors has a 4x performance increase over storing gradients in a input*output matrix        
        const errors = utils.valueFilledArray(this.outputSize, 0);
        for (let j = 0; j < this.outputSize; j++) {
            errors[j] = currentErrors[j];
        }

        return {
            errors: nextErrors,
            gradients: errors
        };
    }

    updateWeights(learningRate, gradients) {
        // wij = wij - lr * gradij
        const { inputs, errors } = gradients;
        for (let i = 0; i < this.inputSize; i++) {
            const weightsI = this.weights[i];
            const inputsInBatch = inputs[i];
            for (let j = 0; j < this.outputSize; j++) {
                let weightIJ = weightsI[j];
                const errorsInBatch = errors[j];
                for (let k = 0; k < inputsInBatch.length; k++) {
                    weightIJ += learningRate * inputsInBatch[k] * errorsInBatch[k];
                }
                weightsI[j] = weightIJ;
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