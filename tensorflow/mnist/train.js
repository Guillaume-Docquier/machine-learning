const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const mnist = require("mnist");

const MNIST_IMAGE_SIZE = 28;
const MNIST_NB_PIXELS = MNIST_IMAGE_SIZE * MNIST_IMAGE_SIZE;
const HIDDEN_LAYER_NB_NEURONS = 300;
const MNIST_NB_CLASSES = 10;

const { training, test } = mnist.set(8000, 2000);

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [MNIST_NB_PIXELS], units: HIDDEN_LAYER_NB_NEURONS, activation: 'relu' }));
model.add(tf.layers.dense({ units: MNIST_NB_CLASSES, activation: 'sigmoid' }));
model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

const trainInput = tf.tensor2d(training.map(data => data.input));
const trainOutput = tf.tensor2d(training.map(data => data.output));
const testInput = tf.tensor2d(test.map(data => data.input));
const testOutput = tf.argMax(tf.tensor2d(test.map(data => data.output)), 1);

main();
async function main() {
    const trainingOutput = await model.fit(trainInput, trainOutput, {
        batchSize: 32,
        epochs: 75,
        shuffle: true
    });

    console.log("\nTesting...");
    const predictionsTensor = model.predict(testInput);
    const predictions = tf.argMax(predictionsTensor, 1);
    const goodPredictions = tf.equal(predictions, testOutput);
    const numberOfGoodPredictions = goodPredictions.sum().dataSync();
    console.log(`Success rate: ${numberOfGoodPredictions} / ${test.length} (${numberOfGoodPredictions / test.length * 100}%)`);

    model.save("file://./mnist.tfm");
}