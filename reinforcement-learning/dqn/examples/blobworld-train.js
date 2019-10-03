const { BlobworldEnv } = require("../../../environments");
const { Sequential, Dense, Linear, Sigmoid, MSE, SGD } = require("../../../neural-networks/src");
const { DQN } = require("../src");

const saveFileName = "blobworld-dqn.ai";
const env = BlobworldEnv(10);

const INPUT_SIZE = env.stateSpace;
const HIDDEN_LAYER_SIZE = 128;
const OUTPUT_SIZE = env.actionSpace;

const model = Sequential({ optimizer: SGD({ learningRate: 0.1, batchSize: 32 }) })
    .add(Dense(INPUT_SIZE,        HIDDEN_LAYER_SIZE, Sigmoid()))
    .add(Dense(HIDDEN_LAYER_SIZE, OUTPUT_SIZE,       Linear()));

DQN(model).train(env, 25000, saveFileName);