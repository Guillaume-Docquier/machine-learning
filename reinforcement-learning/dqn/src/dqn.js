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

    train(env, nbEpisodes, saveFileName = null) {
        const maxActions = 200;
        for (let i = 1; i <= nbEpisodes; i++) {
            let currentObservation = env.reset();
            let isDone = false;
            let episodeReward = 0;
            for (let j = 0; j < maxActions && !isDone; j++) {
                const action = this.getAction(currentObservation, env.actionSpace);
                const { observation, reward, done } = env.step(action);

                isDone = done;
                episodeReward += reward;
                this.memory.push(new Transition(currentObservation, action, reward, observation, done));
                this.fit();
            }

            console.log(`Reward: ${episodeReward}`);
            if (i % this.targetUpdate === 0) {

                this.targetNetwork = this.policyNetwork.clone();
                if (saveFileName) {
                    this.targetNetwork.save(saveFileName);
                    console.log("SAVED!");
                }
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

            let targetReward = reward;
            if (!done) {
                const futureQs = this.targetNetwork.feedForward(nextState).output;
                //console.log(`Future Qs: ${futureQs}`);
                const expectedBestFutureReward = this.discount * Math.max(...futureQs);
                //console.log(`Expected best future reward: ${expectedBestFutureReward}`);
                targetReward += expectedBestFutureReward;
            }

            qs[action] = targetReward

            trainData[i] = { input: state, output: qs };
        }

        //console.log(trainData);
        this.policyNetwork.train(trainData, 1);

        if (this.epsilon > this.epsilonEnd) {
            this.epsilon *= this.epsilonDecayRate;
        }
    }
}

module.exports = {
    DQN: (...args) => new DQN(...args),
}