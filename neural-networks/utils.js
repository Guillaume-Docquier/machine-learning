const fs = require("fs");

function writeFileSync(filePath, content) {
    return fs.writeFileSync(filePath, content, handleWriteError);
}

function handleWriteError(error) {
    if (error) {
        throw error;
    }
}

function readFileSync(filePath) {
    return fs.readFileSync(filePath, 'utf8')
}

function filledArray(size, fillGenerator) {
    return (new Array(size)).fill(0).map(fillGenerator);
}

function randomMatrixInitializer(sizeX, sizeY) {
    const randomNumberGenerator = () => Math.random() / 100; // It seems big initial weights can mess backprop 
    const randomArrayGenerator = () => filledArray(sizeY, randomNumberGenerator)
    return filledArray(sizeX, randomArrayGenerator);
}

function MSE(actual, expected) {
    const squaredError = 0;
    for(let i = 0; i < actual.length; i++) {
        squaredError += Math.pow(actual[i] - expected[i], 2);
    }

    return squaredError / actual.length;
}

function getClass(output) {
    let max = 0;
    let outputClass = 0;
    output.forEach((value, i) => {
        if (value > max) {
            max = value;
            outputClass = i;
        }
    })

    return outputClass;
}

module.exports = {
    readFileSync,
    writeFileSync,
    filledArray,
    randomMatrixInitializer,
    getClass
};