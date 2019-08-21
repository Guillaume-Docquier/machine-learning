const assert = require("assert");
const mnist = require("mnist");
const { Sequential, Dense, ReLU, Sigmoid, SGD } = require("../src");
const utils = require("../src/utils.js");

const MNIST_IMAGE_SIZE = 28;
const MNIST_NB_PIXELS = MNIST_IMAGE_SIZE * MNIST_IMAGE_SIZE;
const HIDDEN_LAYER_NB_NEURONS = 300;
const MNIST_NB_CLASSES = 10;

describe("MNIST training", function() {
    it("Should achieve over 85% success rate within 20 seconds of training with a batch size of 1 and 1 epoch", function() {
        this.timeout(20000);

        const { training, test } = mnist.set(8000, 2000);

        const model = Sequential({
                optimizer: SGD({ learningRate: 0.1, batchSize: 1 })
            })
            .add(Dense(MNIST_NB_PIXELS,         HIDDEN_LAYER_NB_NEURONS, ReLU()))
            .add(Dense(HIDDEN_LAYER_NB_NEURONS, MNIST_NB_CLASSES,        Sigmoid()));

        model.train(training, 1);

        let correct = 0;
        for (let i = 0; i < test.length; i++) {
            const predicted = model.predict(test[i].input);
            const expected = utils.getClass(test[i].output);
            if (expected === predicted) {
                correct++;
            }
        }

        const successRate = correct / test.length;
        console.log(`Success rate: ${successRate}`);
        assert(successRate >= 0.85, "Success rate is lower than expected");
    });

    it("Should achieve over 85% success rate within 40 seconds of training with a batch size of 32 and 3 epochs", function() {
        this.timeout(40000);

        const { training, test } = mnist.set(8000, 2000);

        const model = Sequential({
                optimizer: SGD({ learningRate: 0.3, batchSize: 32 })
            })
            .add(Dense(MNIST_NB_PIXELS,         HIDDEN_LAYER_NB_NEURONS, ReLU()))
            .add(Dense(HIDDEN_LAYER_NB_NEURONS, MNIST_NB_CLASSES,        Sigmoid()));

        model.train(training, 3);

        let correct = 0;
        for (let i = 0; i < test.length; i++) {
            const predicted = model.predict(test[i].input);
            const expected = utils.getClass(test[i].output);
            if (expected === predicted) {
                correct++;
            }
        }

        const successRate = correct / test.length;
        console.log(`Success rate: ${successRate}`);
        assert(successRate >= 0.85, "Success rate is lower than expected");
    });
});