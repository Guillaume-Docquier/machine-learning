const utils = require("./utils.js");
const { LayerFactory } = require("./layers/layer-factory.js")

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

    // TODO Save learning rate
    // TODO Add serialize method on layers, they save temp data like input / errors / output
    save(filePath) {
        utils.writeFileSync(filePath, JSON.stringify(this.layers));
    }

    load(filePath) {
        const layerObjs = JSON.parse(utils.readFileSync(filePath));

        this.layers = layerObjs.map(layerObj => LayerFactory(layerObj));
    }
};

module.exports = {
    Sequential: args => new Sequential(args)
}