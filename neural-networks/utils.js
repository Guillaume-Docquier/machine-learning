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
    const randomNumberGenerator = () => Math.random();
    const randomArrayGenerator = () => filledArray(sizeY, randomNumberGenerator)
    return filledArray(sizeX, randomArrayGenerator);
}

module.exports = {
    readFileSync,
    writeFileSync,
    filledArray,
    randomMatrixInitializer
};