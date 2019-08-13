const { DenseFactory } = require("./dense.js");
const { ReLUFactory } = require("./relu.js");
const { SigmoidFactory } = require("./sigmoid.js");

const layerFactories = [
    DenseFactory,
    ReLUFactory,
    SigmoidFactory
];

const LayerFactory = function(layerData) {
    let layer = null;
    for (let i = 0; i < layerFactories.length && !layer; i++) {
        layer = layerFactories[i](layerData);
    }

    if (!layer) {
        console.log(`No factory could create a layer. Data: ${layerData}`);
    }

    return layer;
}

module.exports = {
    LayerFactory
}