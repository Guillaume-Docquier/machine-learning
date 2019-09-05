const utils = require("../utils");
const { Deserializer } = require("../deserializer.js")
const { Serializer } = require("../serializer.js")
const { MSE } = require("../losses");
const { SGD } = require("../optimizers");

class Sequential {
    constructor(config = {}) {
        this.layers = [];
        this.output = null;
        this.optimizer = config.optimizer || SGD();
        this.loss = config.loss || MSE();
    }

    add(layer) {
        this.layers.push(layer);

        return this;
    }

    predict(input) {
        const { output } = this.feedForward(input);

        return utils.getClass(output);
    }

    // TODO Return losses
    train(data, nbEpochs) {
        console.log("Starting training");
        console.table([{
            "Optimizer": this.optimizer.type,
            "Number of epochs": nbEpochs,
            "Batch size": this.optimizer.batchSize,
            "Learning rate": this.optimizer.learningRate
        }]);

        const startTime = new Date();
        for (let i = 0; i < nbEpochs; i++) {
            console.log(`\nEpoch ${i + 1} of ${nbEpochs}`);
            utils.shuffleInPlace(data);
            this.optimizer.step(data, this);
        }

        const trainTime = (new Date() - startTime);
        const avgEpochTime = trainTime / nbEpochs;
        console.log(`\nTraining done in ${trainTime / 1000}s. Avg epoch time: ${avgEpochTime.toFixed(3)}ms`);
    }

    feedForward(data) {
        let nextInput = data;
        let layerInputs = [];
        for (let i = 0; i < this.layers.length; i++) {
            const { input, output } = this.layers[i].feedForward(nextInput);
            nextInput = output;
            layerInputs.push(input);
        }

        return {
            inputs: layerInputs,
            output: nextInput
        };
    }

    backprop(expected, actual) {
        const outputErrors = this.loss.derivative(expected, actual);

        let nextErrors = outputErrors;
        let layerGradients = [];
        for (let i = this.layers.length - 1; i >= 0; i--) {
            const { errors, gradients } = this.layers[i].backprop(nextErrors);
            nextErrors = errors;
            layerGradients.push(gradients);
        }

        return layerGradients.reverse();
    }

    update(learningRate, layerGradients) {
        this.layers.forEach((layer, i) => layer.updateWeights(learningRate, layerGradients[i]));
    }

    save(filePath) {
        utils.writeFileSync(filePath, this.serialize());
    }

    serialize() {
        return JSON.stringify({
            optimizer: Serializer(this.optimizer),
            loss: Serializer(this.loss),
            layers: this.layers.map(layer => Serializer(layer))
        });
    }

    load(filePath) {
        const data = this.deserialize(utils.readFileSync(filePath));

        for (let property in data) {
            this[property] = data[property];
        }

        return this;
    }

    deserialize(data) {
        const { optimizer, loss, layers } = JSON.parse(data);
        return {
            optimizer: Deserializer(optimizer),
            loss: Deserializer(loss),
            layers: layers.map(layer => Deserializer(layer))
        };
    }

    clone() {
        const data = this.deserialize(this.serialize());

        const clone = new Sequential();
        for (let property in data) {
            clone[property] = data[property];
        }

        return clone;
    }
};

module.exports = {
    Sequential: (...args) => new Sequential(...args)
}