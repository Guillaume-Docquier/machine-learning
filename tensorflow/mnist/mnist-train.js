const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const mnist = require("mnist");
const utils = require("../../utils");

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
const testOutput = tf.tensor2d(test.map(data => data.output));
model.fit(trainInput, trainOutput, {
    batchSize: 32,
    epochs: 3
}).then(trainingOutput => {
    console.log("\nTesting...");
    let correct = 0;
    const predictionsTensor = model.predict(testInput);
    predictionsTensor.print();
    const predictions = predictionsTensor.dataSync(); // Makes it a 1d array, not 2d
    //console.log("Predictions", predictions);
    for (let i = 0; i < test.length; i++) {
        const expected = utils.getClass(test[i].output);
        if (expected === predictions[i]) {
            correct++;
        }
    }

    console.log(`Success rate: ${correct} / ${test.length} (${correct / test.length * 100}%)`);
    //model.save("C:\\Dev\\machine-learning\\mnist.ai");
});