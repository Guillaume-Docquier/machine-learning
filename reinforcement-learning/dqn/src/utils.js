const utils = require("../../../utils");

class Observation {
    constructor(state, action, next_state, reward) {
        this.state = state;
        this.action = action;
        this.next_state = next_state;
        this.reward = reward;
    }
}

class ReplayMemory {
    constructor(capacity) {
        this.capacity = capacity;
        this.memory = [];
    }

    sample() {
        // TODO Need to copy memory beforehand ?

    }
}

module.exports = {
    ...utils,
    Observation,
    ReplayMemory
}