const mnist = require("mnist");
const { Sequential, Dense, ReLU, Sigmoid, SGD } = require("../src");
const utils = require("../src/utils");

const MNIST_IMAGE_SIZE = 28;
const MNIST_NB_PIXELS = MNIST_IMAGE_SIZE * MNIST_IMAGE_SIZE;
const HIDDEN_LAYER_NB_NEURONS = 300;
const MNIST_NB_CLASSES = 10;

const { training, test } = mnist.set(8000, 2000);

const model = Sequential({
        optimizer: SGD({ learningRate: 0.2, batchSize: 32, verbose: true }),
        verbose: true
    })
    .add(Dense(MNIST_NB_PIXELS,         HIDDEN_LAYER_NB_NEURONS, ReLU()))
    .add(Dense(HIDDEN_LAYER_NB_NEURONS, MNIST_NB_CLASSES,        Sigmoid()));

model.train(training, 3);

console.log("\nTesting...");
let correct = 0;
for (let i = 0; i < test.length; i++) {
    const predicted = model.predict(test[i].input);
    const expected = utils.getClass(test[i].output);
    if (expected === predicted) {
        correct++;
    }
}

console.log(`Success rate: ${correct} / ${test.length} (${correct / test.length * 100}%)`);
model.save("mnist.ai");