const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

const mnist = require("mnist");

const MNIST_IMAGE_SIZE = 28;
const MNIST_NB_PIXELS = MNIST_IMAGE_SIZE * MNIST_IMAGE_SIZE;
const HIDDEN_LAYER_NB_NEURONS = 300;
const MNIST_NB_CLASSES = 10;

const { training, test } = mnist.set(8000, 2000);

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [MNIST_NB_PIXELS], units: HIDDEN_LAYER_NB_NEURONS, activation: "relu" }));
model.add(tf.layers.dense({ units: MNIST_NB_CLASSES, activation: "softmax" }));
model.compile({
    optimizer: "sgd",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
});

const trainInput = tf.tensor2d(training.map(data => data.input));
const trainOutput = tf.tensor2d(training.map(data => data.output));
const testInput = tf.tensor2d(test.map(data => data.input));
const testOutput = tf.tensor2d(test.map(data => data.output));

main();
async function main() {
    const fitResult = await model.fit(trainInput, trainOutput, {
        batchSize: 64,
        epochs: 10,
        shuffle: true,
        validationSplit: 0.15
    });

    const evalResult = model.evaluate(testInput, testOutput, {
        batchSize: test.length
    });
    
    const accuracyMetricIndex = fitResult.params.metrics.indexOf("acc");
    const accuracy = await evalResult[accuracyMetricIndex].data();
    console.log(`Test accuracy: ${(accuracy * 100).toFixed(2)}%`);

    model.save("file://./mnist.tfm");
}