const { ReplayMemory, Transition, ...utils } = require("./utils");

// epsilon: Defines how much exploration to use. 1 is random actions all the time
class DQN {
    constructor(model, config = {}) {
        this.targetNetwork = model;
        this.policyNetwork = model.clone();

        // TODO Validate default hyperparams
        this.epsilonStart = config.epsilonStart || 1;
        this.epsilonDecayRate = config.epsilonDecayRate || 0.95;
        this.epsilonEnd = config.epsilonEnd || 0.01;
        this.discount = config.discount || 0.95;
        this.replayMemoryCapacity = config.replayMemoryCapacity || 25 * 1000;
        this.targetUpdate = config.targetUpdate || 5;
        this.batchSize = config.batchSize || 32;
        
        this.epsilon = this.epsilonStart;
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
                this.memory.push(new Transition(currentObservation, action, reward, observation, done));
                this.fit();
            }

            if (i % this.targetUpdate === 0) {
                this.targetNetwork = this.policyNetwork.clone();
            }
        }

        env.close()
    }

    getAction(observation, actionSpace) {
        if (Math.random() <= this.epsilon) {
            return Math.round(Math.random() * (actionSpace - 1));
        }

        return this.policyNetwork.predict(observation);
    }

    fit() {
        if (this.memory.length < this.batchSize) {
            return;
        }

        const batch = this.memory.sample(this.batchSize);
        const trainData = utils.valueFilledArray(batch.length, 0);
        for (let i = 0; i < batch.length; i++) {
            const { state, action, reward, nextState, done } = batch[i];
            const qs = this.policyNetwork.feedForward(state).output;

            const targetReward = reward;
            if (!done) {
                targetReward += this.discount * Math.max(this.targetNetwork.feedForward(nextState).output);
            }

            qs[action] = targetReward

            trainData[i] = { input: state, output: qs };
        }

        this.policyNetwork.train(trainData, 1);

        if (this.epsilon > this.epsilonEnd) {
            this.epsilon *= this.epsilonDecayRate;
        }
    }
}

module.exports = {
    DQN: (...args) => new DQN(...args),
}