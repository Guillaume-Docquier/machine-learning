const { BlobworldEnv } = require("../../../environments");
const { Sequential, Dense, Linear, Sigmoid, ReLU, MSE, SGD } = require("../../../neural-networks/src");
const { DQN } = require("../src");

const saveFileName = "blobworld-dqn.ai";
const env = BlobworldEnv(10);

const INPUT_SIZE = env.stateSpace;
const HIDDEN_LAYER_SIZE = 128;
const OUTPUT_SIZE = env.actionSpace;

const model = Sequential({ 
        optimizer: SGD({ learningRate: 0.1, batchSize: 64 }),
        loss: MSE()
    })
    .add(Dense(INPUT_SIZE,        HIDDEN_LAYER_SIZE, ReLU()))
    .add(Dense(HIDDEN_LAYER_SIZE, OUTPUT_SIZE,       Linear()));

DQN(model, {
    replayMemorySize: 10 * 1000,
    epsilonDecayTime: 1000,
    batchSize: model.batchSize,
    updateEvery: 10,
    epsilonEnd: 0.05
}).train(env, 5000, saveFileName);