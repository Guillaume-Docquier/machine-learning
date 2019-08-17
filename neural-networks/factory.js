const allFactories = [
    ...require("./activations").factories,
    ...require("./layers").factories,
    ...require("./losses").factories,
    ...require("./optimizers").factories
];

const Factory = function(data) {
    let object = null;
    for (let i = 0; i < allFactories.length && !object; i++) {
        object = allFactories[i](data, Factory);
    }

    if (!object) {
        console.log(`No factory could create object from data. Data: ${data}`);
    }

    return object;
}

module.exports = {
    Factory
}