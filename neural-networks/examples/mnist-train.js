const mnist = require("mnist");
const { Sequential, Dense, ReLU, Sigmoid, SGD } = require("../src");
const utils = require("../src/utils.js");

const MNIST_IMAGE_SIZE = 28;
const MNIST_NB_PIXELS = MNIST_IMAGE_SIZE * MNIST_IMAGE_SIZE;
const HIDDEN_LAYER_NB_NEURONS = 300;
const MNIST_NB_CLASSES = 10;

const { training, test } = mnist.set(8000, 2000);

const model = Sequential({ optimizer: SGD({ learningRate: 0.1 }) })
    .add(Dense(MNIST_NB_PIXELS,         HIDDEN_LAYER_NB_NEURONS, ReLU()))
    .add(Dense(HIDDEN_LAYER_NB_NEURONS, MNIST_NB_CLASSES,        Sigmoid()));

const startTime = new Date();

console.log("Training...");
for (let i = 0; i < training.length; i++) {
    const avgIterationTime = (new Date() - startTime) / i + 1;
    utils.progress(`Iteration ${i + 1} of ${training.length}. Avg time per iteration: ${avgIterationTime.toFixed(3)}ms`);
    model.feedForward(training[i].input);
    model.fit(training[i].output);
}

console.log("\n\nTesting...");
let correct = 0;
for (let i = 0; i < test.length; i++) {
    const predicted = model.predict(test[i].input);
    const expected = utils.getClass(test[i].output);
    if (expected === predicted) {
        correct++;
    } else {
        // console.log(`${expected}:${predicted}`);
    }
}

console.log(`Success rate: ${correct} / ${test.length} (${correct / test.length * 100}%)`);
model.save("mnist.ai");