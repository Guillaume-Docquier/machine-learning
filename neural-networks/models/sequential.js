const utils = require("../utils.js");
const { LayerFactory } = require("../layers")

class Sequential {
    constructor(learningRate = 0.01) {
        this.layers = [];
        this.output = null;
        this.learningRate = learningRate;
    }

    add(layer) {
        this.layers.push(layer);

        return this;
    }

    feedForward(input) {
        this.output = this.layers.reduce((nextInput, layer) => layer.feedForward(nextInput), input);

        return this.output;
    }

    predict(input) {
        const output = this.feedForward(input);

        return utils.getClass(output);
    }

    fit(expected) {
        const outputErrors = this.output.map((output, i) => expected[i] - output);

        // Backprop
        this.layers.reduceRight((nextErrors, layer) => layer.backPropagate(nextErrors), outputErrors);

        // Update
        this.layers.forEach(layer => layer.updateWeights(this.learningRate));
    }

    print() {
        this.layers.forEach(layer => console.log(layer));
    }

    save(filePath) {
        const { learningRate, layers } = this;
        const serialized = {
            learningRate,
            layers: layers.map(layer => layer.serialize())
        }

        utils.writeFileSync(filePath, JSON.stringify(serialized));
    }

    load(filePath) {
        const { learningRate, layers } = JSON.parse(utils.readFileSync(filePath));

        this.learningRate = Number(learningRate);
        this.layers = layers.map(layer => LayerFactory(layer));

        return this;
    }
};

module.exports = {
    Sequential: (...args) => new Sequential(...args)
}