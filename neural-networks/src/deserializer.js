const allDeserializers = [
    ...require("./activations").deserializers,
    ...require("./layers").deserializers,
    ...require("./losses").deserializers,
    ...require("./optimizers").deserializers
];

const Deserializer = function(data) {
    let object = null;
    
    for (let i = 0; i < allDeserializers.length && !object; i++) {
        object = allDeserializers[i](data, Deserializer);
    }

    if (!object) {
        console.log(`No deserializer could create object from data. Data: ${JSON.stringify(data)}`);
    }

    return object;
}

module.exports = {
    Deserializer
}