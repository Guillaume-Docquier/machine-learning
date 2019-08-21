const assert = require("assert");
const fs = require("fs");
const utils = require("../src/utils.js");
const { Sequential, Dense, ReLU, Sigmoid, SGD } = require("../src");

const SAVE_FILE_NAME = "save.test.ai";

describe("Models", function() {
    describe("Sequential", function() {
        afterEach(function() {
            if (fs.existsSync(SAVE_FILE_NAME)) {
                fs.unlinkSync(SAVE_FILE_NAME);
            }
        });

        it("Should save to file and load from file", function() {
            const intputSize = 700;
            const hiddenLayerSize = 300;
            const outputSize = 8;

            const randomData = utils.generatorFilledArray(intputSize, Math.random);

            const model = Sequential({
                    optimizer: SGD({ learningRate: 0.23 })
                })
                .add(Dense(intputSize,            hiddenLayerSize,       ReLU()))
                .add(Dense(hiddenLayerSize,       hiddenLayerSize - 100, Sigmoid()))
                .add(Dense(hiddenLayerSize - 100, hiddenLayerSize - 200, ReLU()))
                .add(Dense(hiddenLayerSize - 200, outputSize,            Sigmoid()))

            const expectedOutput = model.feedForward(randomData);
            model.save(SAVE_FILE_NAME);

            const saveFileExists = fs.existsSync(SAVE_FILE_NAME);
            assert(saveFileExists, "Model was not saved to file");

            const reloadedModel = Sequential().load(SAVE_FILE_NAME);
            const actualOutput = reloadedModel.feedForward(randomData);

            assert.deepStrictEqual(actualOutput, expectedOutput, "Reloaded model did not output the same thing for the same input");
        });
    });
});