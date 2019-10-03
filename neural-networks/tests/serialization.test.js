const assert = require("assert");
const { Serializer } = require("../src/serializer.js");
const { Deserializer } = require("../src/deserializer.js");
const { Dense, ReLU, Sigmoid, Linear, SGD, MSE } = require("../src");

describe("Serialization", function() {
    describe("Layers", function() {
        it("Should work with Dense", function() {
            const dense = Dense(1, 2, ReLU());
    
            const serialized = Serializer(dense);
            assert(serialized, "Serialized was null");
    
            const deserialized = Deserializer(serialized);
            assert.deepStrictEqual(dense, deserialized, "Deserialized is not the same as the original");
        });
    });

    describe("Activations", function() {
        it("Should work with ReLU", function() {
            const relu = ReLU();

            const serialized = Serializer(relu);
            assert(serialized, "Serialized was null");

            const deserialized = Deserializer(serialized);
            assert.deepStrictEqual(relu, deserialized, "Deserialized is not the same as the original");
        });

        it("Should work with Sigmoid", function() {
            const sigmoid = Sigmoid();

            const serialized = Serializer(sigmoid);
            assert(serialized, "Serialized was null");

            const deserialized = Deserializer(serialized);
            assert.deepStrictEqual(sigmoid, deserialized, "Deserialized is not the same as the original");
        });

        it("Should work with Linear", function() {
            const linear = Linear();

            const serialized = Serializer(linear);
            assert(serialized, "Serialized was null");

            const deserialized = Deserializer(serialized);
            assert.deepStrictEqual(linear, deserialized, "Deserialized is not the same as the original");
        });
    });

    describe("Optimizers", function() {
        it("Should work with SGD", function() {
            const sgd = SGD({ learningRate: 0.43 });
    
            const serialized = Serializer(sgd);
            assert(serialized, "Serialized was null");
    
            const deserialized = Deserializer(serialized);
            assert.deepStrictEqual(sgd, deserialized, "Deserialized is not the same as the original");
        });
    });

    describe("Losses", function() {
        it("Should work with MSE", function() {
            const mse = MSE();
    
            const serialized = Serializer(mse);
            assert(serialized, "Serialized was null");
    
            const deserialized = Deserializer(serialized);
            assert.deepStrictEqual(mse, deserialized, "Deserialized is not the same as the original");
        });
    });
});