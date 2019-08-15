const mnist = require('mnist');
const { Sequential, Dense, ReLU, Sigmoid } = require("../index.js");
const utils = require("../utils.js");

const MNIST_IMAGE_SIZE = 28;
const MNIST_NB_PIXELS = MNIST_IMAGE_SIZE * MNIST_IMAGE_SIZE;
const HIDDEN_LAYER_NB_NEURONS = 300;
const MNIST_NB_CLASSES = 10;

const { training, test } = mnist.set(8000, 2000);
//console.log(utils.getClass(training[0].output));
//printImage(training[0].input);

const model = Sequential(0.1)
    .add(Dense(MNIST_NB_PIXELS,         HIDDEN_LAYER_NB_NEURONS, ReLU()))
    .add(Dense(HIDDEN_LAYER_NB_NEURONS, MNIST_NB_CLASSES,        Sigmoid()));

console.log("Training...");
for (let i = 0; i < training.length; i++) {
    console.log(`Iteration ${i + 1} of ${training.length}`);
    model.feedForward(training[i].input);
    model.fit(training[i].output);
}

console.log("Testing...");
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

function printImage(pixels) {
    for (let i = 0; i < MNIST_IMAGE_SIZE; i++) {
        let row = "";
        for (let j = 0; j < MNIST_IMAGE_SIZE; j++) {
            row += pixels[i * MNIST_IMAGE_SIZE + j] ? "X" : " ";
        }
        console.log(row);
    }
}