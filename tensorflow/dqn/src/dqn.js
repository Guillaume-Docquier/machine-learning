const { ReplayMemory, Transition, ...utils } = require("./utils");

// epsilon: Defines how much exploration to use. 1 is random actions all the time
class DQN {
    constructor(model, config = {}) {
        this.targetNetwork = model;
        this.policyNetwork = model.clone();

        // TODO Validate default hyperparams
        this.epsilonInitial = config.epsilonInitial || 1;
        this.epsilonDecayTime = config.epsilonDecayTime || 0.9999;
        this.epsilonDecayStart = config.epsilonDecayStart || 300;
        this.epsilonEnd = config.epsilonEnd || 0.1;
        this.discount = config.discount || 0.95;
        this.replayMemorySize = config.replayMemorySize || 25 * 1000;
        this.minimumReplayMemorySize = config.minimumReplayMemorySize || 1000;
        this.updateEvery = config.updateEvery || 5;
        this.batchSize = config.batchSize || 64;
        
        this.epsilon = this.epsilonInitial;
        this.memory = new ReplayMemory(this.replayMemorySize);
    }

    train(env, nbEpisodes, saveFileName = null) {
        const maxActions = 100;
        const rollingAverageLength = 50;
        const rewards = new ReplayMemory(rollingAverageLength);
        for (let episode = 1; episode <= nbEpisodes; episode++) {
            let currentObservation = env.reset();
            let isDone = false;
            let episodeReward = 0;
            for (let i = 0; i < maxActions && !isDone; i++) {
                const action = this.getAction(currentObservation, env.actionSpace);
                const { observation, reward, done } = env.step(action);

                isDone = done;
                episodeReward += reward;
                this.memory.push(new Transition(currentObservation, action, reward, observation, done));
                this.fit();
            }
            
            this.updateEpsilon(episode);
            if (episode % this.updateEvery === 0) {
                this.targetNetwork = this.policyNetwork.clone();
                if (saveFileName) {
                    this.targetNetwork.save(saveFileName);
                }
            }

            rewards.push(episodeReward);
            const avgReward = rewards.buffer.reduce((avg, reward) => avg + reward / Math.min(rollingAverageLength, episode), 0);
            //console.log(`Episode: ${episode} | Epsilon: ${this.epsilon.toFixed(5)} | Reward: ${episodeReward} | Avg Reward Of Last 50 runs: ${avgReward.toFixed(5)}`);
            utils.progress(`Episode: ${episode} | Epsilon: ${this.epsilon.toFixed(5)} | Reward: ${episodeReward} | Avg Reward Of Last 50 runs: ${avgReward.toFixed(5)}`);
        }

        env.close()
    }

    updateEpsilon(episode) {
        if (episode > this.epsilonDecayStart && this.epsilon > this.epsilonEnd) {
            this.epsilon -= (this.epsilonInitial - this.epsilonEnd) / this.epsilonDecayTime;
        }
    }

    getAction(observation, actionSpace) {
        if (Math.random() <= this.epsilon) {
            return Math.round(Math.random() * (actionSpace - 1));
        }

        return this.policyNetwork.predict(observation);
    }

    fit() {
        if (this.memory.length < this.minimumReplayMemorySize) {
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

        this.policyNetwork.train(trainData, 1);
    }
}

module.exports = {
    DQN: (...args) => new DQN(...args),
}