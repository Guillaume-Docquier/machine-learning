const utils = require("./utils.js");
const { LayerFactory } = require("./layer-factory.js")

class Sequential {
    constructor() {
        this.layers = [];
    }

    add(layer) {
        this.layers.push(layer);

        return this;
    }

    feedForward(input) {
        return this.layers.reduce((nextInput, layer) => layer.feedForward(nextInput), input);
    }

    print() {
        this.layers.forEach(layer => console.log(layer));
    }

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