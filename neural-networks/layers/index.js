const { Dense, DenseFactory, DenseSerializer } = require("./dense.js");

module.exports = {
    Dense,
    factories: [DenseFactory],
    serializers: [DenseSerializer]
}