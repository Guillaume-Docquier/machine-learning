const { Dense, DenseDeserializer, DenseSerializer } = require("./dense.js");

module.exports = {
    Dense,
    deserializers: [DenseDeserializer],
    serializers: [DenseSerializer]
}