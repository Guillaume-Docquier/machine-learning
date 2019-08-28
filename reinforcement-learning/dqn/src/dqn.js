class DQN {
    constructor(config = {}) {
        this.learningRate = config.learningRate || 0.1;
        this.epsilon = config.epsilon || 0.5;
        this.discount = config.discount || 0.95;
        this.model = config.model;
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