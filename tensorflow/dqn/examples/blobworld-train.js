const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const { BlobworldEnv } = require("../../../environments");
const { DQN } = require("../src");

const saveFileName = "blobworld-dqn.ai";
const env = BlobworldEnv(10);

const INPUT_SIZE = env.stateSpace;
const HIDDEN_LAYER_SIZE = 128;
const OUTPUT_SIZE = env.actionSpace;

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [INPUT_SIZE], units: HIDDEN_LAYER_SIZE, activation: 'relu' }));
model.add(tf.layers.dense({ units: OUTPUT_SIZE, activation: 'linear' }));
model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

/* DQN(model, {
    replayMemorySize: 10 * 1000,
    epsilonDecayTime: 1000,
    batchSize: model.batchSize,
    updateEvery: 10,
    epsilonEnd: 0.05
}).train(env, 5000, saveFileName); */