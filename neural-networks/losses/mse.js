class MSE {
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
    MSE: () => new MSE()
}