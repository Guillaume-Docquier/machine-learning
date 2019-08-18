const utils = require("../utils.js");
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

    feedForward(input) {
        this.output = this.layers.reduce((nextInput, layer) => layer.feedForward(nextInput), input);

        return this.output;
    }

    predict(input) {
        const output = this.feedForward(input);

        return utils.getClass(output);
    }

    fit(expected) {
        const outputErrors = this.loss.derivative(expected, this.output);

        // Backprop
        this.layers.reduceRight((nextErrors, layer) => layer.backPropagate(nextErrors), outputErrors);

        // Update
        this.layers.forEach(layer => layer.updateWeights(this.optimizer.learningRate));
    }

    print() {
        this.layers.forEach(layer => console.log(layer));
    }

    save(filePath) {
        const serialized = {
            optimizer: Serializer(this.optimizer),
            loss: Serializer(this.loss),
            layers: this.layers.map(layer => Serializer(layer))
        }

        utils.writeFileSync(filePath, serialized);
    }

    load(filePath) {
        const { optimizer, loss, layers } = utils.readFileSync(filePath);

        this.optimizer = Deserializer(optimizer);
        this.loss = Deserializer(loss);
        this.layers = layers.map(layer => Deserializer(layer));

        return this;
    }
};

module.exports = {
    Sequential: (...args) => new Sequential(...args)
}