const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const { BlobworldEnv } = require("../../../environments");
const { DQN } = require("../src");

const saveFilePath = "file://./blobworld-dqn.tfm";
const env = BlobworldEnv(10);

const INPUT_SIZE = env.stateSpace;
const HIDDEN_LAYER_SIZE = 1024;
const OUTPUT_SIZE = env.actionSpace;

const policyNetwork = createNetwork();
const targetNetwork = createNetwork();

DQN(policyNetwork, targetNetwork, env, {
    replayMemorySize: 10 * 1000,
    epsilonDecayTime: 1000,
    batchSize: 64,
    updateEvery: 10,
    epsilonEnd: 0.05,
    epsilonInitial: 1,
    epsilonDecayStart: 500
}).train(2000, saveFilePath);

function createNetwork() {
    const network = tf.sequential();
    network.add(tf.layers.dense({ inputShape: [INPUT_SIZE], units: HIDDEN_LAYER_SIZE, activation: 'relu' }));
    network.add(tf.layers.dense({ units: OUTPUT_SIZE, activation: 'linear' }));
    network.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
    });

    return network;
}