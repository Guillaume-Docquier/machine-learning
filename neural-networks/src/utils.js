const fs = require("fs");
const readline = require("readline");

function writeFileSync(filePath, content) {
    return fs.writeFileSync(filePath, JSON.stringify(content), handleWriteError);
}

function handleWriteError(error) {
    if (error) {
        throw error;
    }
}

function readFileSync(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function valueFilledArray(size, value) {
    return (new Array(size)).fill(value);
}

function generatorFilledArray(size, generator) {
    return (new Array(size)).fill(0).map(generator);
}

function randomMatrixInitializer(sizeX, sizeY) {
    const randomNumberGenerator = () => Math.random() / 100; // It seems big initial weights can mess backprop 
    const randomArrayGenerator = () => generatorFilledArray(sizeY, randomNumberGenerator);
    return generatorFilledArray(sizeX, randomArrayGenerator);
}

function getClass(output) {
    let max = 0;
    let outputClass = 0;
    output.forEach((value, i) => {
        if (value > max) {
            max = value;
            outputClass = i;
        }
    });

    return outputClass;
}

function progress(text) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(text);
}

function shuffleInPlace(array) {
    var j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}

module.exports = {
    readFileSync,
    writeFileSync,
    valueFilledArray,
    generatorFilledArray,
    randomMatrixInitializer,
    getClass,
    progress,
    shuffleInPlace
};