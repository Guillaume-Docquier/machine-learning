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
        this.memory = new Array(capacity);

        this.position = 0;
    }

    push(observation) {
        this.memory[this.position] = observation;
        this.position = (this.position + 1) % this.capacity;
    }

    sample(count) {
        // TODO Is it bad to do it in place ?
        utils.shuffleInPlace(this.memory);

        return this.memory.slice(0, count);
    }
}

module.exports = {
    ...utils,
    Observation,
    ReplayMemory
}