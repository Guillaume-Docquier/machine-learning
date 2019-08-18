const allSerializers = [
    ...require("./activations").serializers,
    ...require("./layers").serializers,
    ...require("./losses").serializers,
    ...require("./optimizers").serializers
];

const Serializer = function(object) {
    let serialized = null;
    for (let i = 0; i < allSerializers.length && !serialized; i++) {
        serialized = allSerializers[i](object, Serializer);
    }

    if (!serialized) {
        console.log(`No serializer could handle object. Object: ${object}`);
    }

    return serialized;
}

module.exports = {
    Serializer
}