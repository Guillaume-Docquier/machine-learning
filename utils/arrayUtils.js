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

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
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
    valueFilledArray,
    generatorFilledArray,
    randomMatrixInitializer,
    shuffleInPlace
};