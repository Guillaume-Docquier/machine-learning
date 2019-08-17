class SGD {
    constructor(config = {}) {
        this.learningRate = config.learningRate || 0.01;
    }
}

module.exports = {
    SGD: (...args) => new SGD(...args)
}