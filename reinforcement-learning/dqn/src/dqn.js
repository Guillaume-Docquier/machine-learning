const { ReplayMemory, Transition } = require("./utils");

// epsilon: Defines how much exploration to use. 1 is random actions all the time
class DQN {
    constructor(model, config = {}) {
        this.targetNetwork = model;
        this.policyNetwork = model.clone();

        // TODO Validate default hyperparams
        this.learningRate = config.learningRate || 0.1;
        this.epsilon = config.epsilon || 0.5;
        this.discount = config.discount || 0.95;
        this.replayMemoryCapacity = config.replayMemoryCapacity || 25 * 1000;
        this.targetUpdate = config.targetUpdate || 5;
        this.batchSize = config.batchSize || 32;
        
        this.memory = new ReplayMemory(this.replayMemoryCapacity);
    }

    train(env, nbEpisodes) {
        const maxActions = 2000;
        for (let i = 0; i < nbEpisodes; i++) {
            let currentObservation = env.reset();
            let isDone = false;
            for (let j = 0; j < maxActions && !isDone; j++) {
                const action = this.getAction(currentObservation, env.actionSpace);
                const { observation, reward, done } = env.step(action);

                isDone = done;
                this.memory.push(new Transition(currentObservation, action, reward, observation));
                this.fit();
            }

            if (i % this.targetUpdate === 0) {
                this.targetNetwork = this.policyNetwork.clone();
            }
        }

        env.close()
    }

    getAction(observation, actionSpace) {
        const explorationRoll = Math.random();
        if (explorationRoll < this.epsilon) {
            return Math.round(Math.random() * (actionSpace - 1));
        }

        return this.policyNetwork.predict(observation);
    }

    fit() {
        if (this.memory.length < this.batchSize) {
            return;
        }

        const batch = this.memory.sample(this.batchSize);
        // TODO Implement training

        return null;
    }
}

module.exports = {
    DQN: (...args) => new DQN(...args),
}