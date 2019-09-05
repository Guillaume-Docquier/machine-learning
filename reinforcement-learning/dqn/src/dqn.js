const { ReplayMemory, Observation } = require("./utils");

// epsilon: Defines how much exploration to use. 1 is random actions all the time
class DQN {
    constructor(config = {}) {
        this.targetNetwork = config.model;
        this.policyNetwork = config.model.clone();

        this.learningRate = config.learningRate || 0.1;
        this.epsilon = config.epsilon || 0.5;
        this.discount = config.discount || 0.95;
        this.replayMemoryCapacity = config.replayMemoryCapacity || 25 * 1000;
        
        this.memory = new ReplayMemory(this.replayMemoryCapacity);
    }

    train(env) {

    }

    step() {
        return null;
    }

    learn() {
        return null;
    }
}

module.exports = {
    DQN: (...args) => new DQN(...args),
}