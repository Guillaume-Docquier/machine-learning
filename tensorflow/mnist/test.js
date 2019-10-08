const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const mnist = require("mnist");
const utils = require("../../utils");

const MNIST_IMAGE_SIZE = 28;

const { test } = mnist.set(0, 10000);
utils.shuffleInPlace(test);
const randomTestData = test.slice(0, 10);
const inputTensor = tf.tensor2d(randomTestData.map(data => data.input));

main();
async function main() {
    const model = await tf.loadLayersModel("file://./mnist.tfm/model.json");

    const predictionTensor = model.predict(inputTensor);
    const predictions = tf.argMax(predictionTensor, 1).dataSync();
    for (let i = 0; i < randomTestData.length; i++) {
        printImage(randomTestData[i].input);
        console.log(`Prediction: ${predictions[i]}`);
    }
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