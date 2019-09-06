class BlobworldEnv {
    constructor() {
        this.actionSpace = 0;
    }

    reset() {
        const observation = {};

        return observation;
    }

    step() {
        const observation = {};
        const reward = 0;
        const done = false;

        return { observation, reward, done };
    }

    render() {
        return null;
    }

    close() {
        return null;
    }
}

module.exports = {
    BlobworldEnv: (...args) => new BlobworldEnv(...args),
}