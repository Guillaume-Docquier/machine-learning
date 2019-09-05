const { BlobworldEnv } = require("../../../environments");
const { Sequential, Dense, ReLU, Sigmoid, MSE, SGD } = require("../../../neural-networks/src");
const { DQN } = require("../src");

const INPUT_SIZE = 700;
const HIDDEN_LAYER_SIZE = 300;
const OUTPUT_SIZE = 10;

const model = Sequential({ optimizer: SGD({ learningRate: 0.2, batchSize: 32 }) })
    .add(Dense(INPUT_SIZE,        HIDDEN_LAYER_SIZE, ReLU()))
    .add(Dense(HIDDEN_LAYER_SIZE, OUTPUT_SIZE,       Sigmoid()));

const dqn = DQN({ model });

dqn.train(BlobworldEnv);