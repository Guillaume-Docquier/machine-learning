const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

const { ReplayMemory, Transition, ...utils } = require("./utils");

// epsilon: Defines how much exploration to use. 1 is random actions all the time
class DQN {
    constructor(policyNetwork, targetNetwork, env, config = {}) {
        this.policyNetwork = policyNetwork;
        this.targetNetwork = targetNetwork;
        // this.targetNetwork.trainable = false;
        this.updateTargetNetwork();
        this.env = env;

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

    updateTargetNetwork() {
        this.targetNetwork.setWeights(this.policyNetwork.getWeights());
    }

    async train(nbEpisodes, saveFilePath = null) {
        const maxActions = 100;
        const rollingAverageLength = 50;
        const rewards = new ReplayMemory(rollingAverageLength);
        for (let episode = 1; episode <= nbEpisodes; episode++) {
            let currentObservation = this.env.reset();
            let isDone = false;
            let episodeReward = 0;
            for (let i = 0; i < maxActions && !isDone; i++) {
                const action = this.getAction(currentObservation);
                const { observation, reward, done } = this.env.step(action);

                isDone = done;
                episodeReward += reward;
                this.memory.push(new Transition(currentObservation, action, reward, observation, done));
                await this.fit();
            }
            
            this.updateEpsilon(episode);
            if (episode % this.updateEvery === 0) {
                this.updateTargetNetwork();
                if (saveFilePath) {
                    this.targetNetwork.save(saveFilePath);
                }
            }

            rewards.push(episodeReward);
            const avgReward = rewards.buffer.reduce((avg, reward) => avg + reward / Math.min(rollingAverageLength, episode), 0);
            //console.log(`Episode: ${episode} | Epsilon: ${this.epsilon.toFixed(5)} | Reward: ${episodeReward} | Avg Reward Of Last 50 runs: ${avgReward.toFixed(5)}`);
            utils.progress(`NbTensors: ${tf.memory().numTensors} | Episode: ${episode} | Epsilon: ${this.epsilon.toFixed(5)} | Reward: ${episodeReward} | Avg Reward Of Last 50 runs: ${avgReward.toFixed(5)}`);
        }

        this.env.close()
    }

    updateEpsilon(episode) {
        if (episode > this.epsilonDecayStart && this.epsilon > this.epsilonEnd) {
            this.epsilon -= (this.epsilonInitial - this.epsilonEnd) / this.epsilonDecayTime;
        }
    }

    getQs(observation) {
        const observationTensor = tf.tensor2d([observation]);
        const qsTensor = this.policyNetwork.predict(observationTensor, { batchSize: 1 });

        observationTensor.dispose();

        return qsTensor;
    }

    getAction(observation) {
        if (Math.random() <= this.epsilon) {
            return Math.round(Math.random() * (this.env.actionSpace - 1));
        }

        const actionTensor = this.getQs(observation).argMax();
        const action = actionTensor.dataSync()[0];

        actionTensor.dispose();

        return action;
    }

    async fit() {
        if (this.memory.length < this.minimumReplayMemorySize) {
            return;
        }

        const batch = this.memory.sample(this.batchSize);
        const trainInput = utils.valueFilledArray(batch.length, 0);
        const trainOutput = utils.valueFilledArray(batch.length, 0);
        for (let i = 0; i < batch.length; i++) {
            const { state, action, reward, nextState, done } = batch[i];
            const qsTensor = this.getQs(state);
            const qs = qsTensor.dataSync();

            qsTensor.dispose();

            let targetReward = reward;
            if (!done) {
                const bestFutureQTensor = this.getQs(nextState).max();
                const bestFutureQ = bestFutureQTensor.dataSync()[0];

                bestFutureQTensor.dispose();

                //console.log(`Future Qs: ${futureQs}`);
                const expectedBestFutureReward = this.discount * bestFutureQ;
                //console.log(`Expected best future reward: ${expectedBestFutureReward}`);
                targetReward += expectedBestFutureReward;
            }

            qs[action] = targetReward

            trainInput[i] = state;
            trainOutput[i] = qs;
        }

        const trainInputTensor = tf.tensor2d(trainInput);
        const trainOutputTensor = tf.tensor2d(trainOutput);
        await this.policyNetwork.fit(trainInputTensor, trainOutputTensor, {
            batchSize: this.batchSize,
            epochs: 10,
            shuffle: true,
            verbose: false
        });

        trainInputTensor.dispose();
        trainOutputTensor.dispose();
    }
}

module.exports = {
    DQN: (...args) => new DQN(...args),
}