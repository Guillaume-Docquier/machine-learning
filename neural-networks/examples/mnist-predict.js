const mnist = require('mnist');
const { Sequential } = require("../index.js");

const MNIST_IMAGE_SIZE = 28;

const { training, test } = mnist.set(0, 10);

const model = Sequential().load("mnist.ai");

for (let i = 0; i < test.length; i++) {
    printImage(test[i].input);
    console.log(`Prediction: ${model.predict(test[i].input)}`);
}

function printImage(pixels) {
    for (let i = 0; i < MNIST_IMAGE_SIZE; i++) {
        let row = "";
        for (let j = 0; j < MNIST_IMAGE_SIZE; j++) {
            row += pixels[i * MNIST_IMAGE_SIZE + j] ? "X" : " ";
        }
        console.log(row);
    }
}