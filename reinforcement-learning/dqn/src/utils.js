const utils = require("../../../utils");

class Transition {
    constructor(state, action, reward, nextState) {
        this.state = state;
        this.action = action;
        this.reward = reward;
        this.nextState = nextState;
    }
}

class ReplayMemory {
    constructor(capacity) {
        this.capacity = capacity;
        this.buffer = [];

        this.position = 0;
    }

    push(transition) {
        if (this.buffer.length < this.capacity) {
            this.buffer.push(null);
        }

        this.buffer[this.position] = transition;
        this.position = (this.position + 1) % this.capacity;
    }

    sample(count) {
        const bufferCopy = this.buffer.slice();
        utils.shuffleInPlace(bufferCopy);

        return bufferCopy.slice(0, count);
    }

    get length() {
        return this.buffer.length;
    }
}

module.exports = {
    ...utils,
    Transition,
    ReplayMemory
}