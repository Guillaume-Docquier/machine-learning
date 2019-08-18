const LOSS_TYPE = "MSE";

const MSEDeserializer = function(lossData) {
    if (lossData.type !== LOSS_TYPE) {
        return false;
    }

    return new MSE();
};

const MSESerializer = function(loss) {
    if (loss.type !== LOSS_TYPE) {
        return false;
    }

    const { type } = loss;
    return {
        type
    };
};

class MSE {
    constructor() {
        this.type = LOSS_TYPE
    }

    compute(expectedValues, actualValues) {
        const squaredError = actualValues.reduce(
            (sum, actualValue, i) => sum + Math.pow(expectedValues[i] - actualValue, 2),
            0
        );
    
        return squaredError / actual.length;
    }

    derivative(expectedValues, actualValues) {
        return actualValues.map((actualValue, i) => (expectedValues[i] - actualValue));
    }
}

module.exports = {
    MSE: () => new MSE(),
    MSEDeserializer,
    MSESerializer
}