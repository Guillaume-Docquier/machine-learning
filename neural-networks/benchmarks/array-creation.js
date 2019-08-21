const utils = require("../src/utils.js");

const methodNames = {
    new: "new",
    push: "push"
}

const tests = [];

let dim = 0;
for (let i = 0; i < 10; i++) {
    dim += 103
    tests.push(...createTests(dim));
}

tests.push(...createTests(10)); // Very small
tests.push(...createTests(216)); // ~ Cube root of 10.000.000

const arrayCreationMethods = {
    [methodNames.new]: createMatrixUsingNew,
    [methodNames.push]: createMatrixUsingPush
}

const columnDisplayNames = {
    name: "Method",
    dimensions: "Dimensions",
    elements: "Number of operations",
    ops: "Ops per μs"
}

const targetNbElements = 10 * 1000 * 1000;
console.log("Benchmarking the creation of 10.000.000 elements");

const generator = () => 0;
const creationResults = [];
const sequentialReadsResults = [];
const randomReadsResults = [];
for (let i = 0; i < tests.length; i++) {
    const { method, dim1, dim2 } = tests[i];
    const dim3 = Math.ceil(targetNbElements / dim1 / dim2);
    const nbElements = dim3 * dim1 * dim2;

    utils.progress(`Test ${i + 1} of ${tests.length}`);

    const [createDuration, array] = timeArrayCreation(() => arrayCreationMethods[method](dim3, dim1, dim2, generator));
    creationResults.push(result(method, dim3, dim1, dim2, nbElements, createDuration));

    const sequentialReadsDuration = timeArraySequentialReads(array);
    sequentialReadsResults.push(result(method, dim3, dim1, dim2, nbElements, sequentialReadsDuration));

    const randomReadsDuration = timeArrayRandomReads(array);
    randomReadsResults.push(result(method, dim3, dim1, dim2, nbElements, randomReadsDuration));
}

creationResults.sort(byHighestOps);
sequentialReadsResults.sort(byHighestOps);
randomReadsResults.sort(byHighestOps);

console.log("\nArray creation results:");
console.table(creationResults);

console.log("\nArray sequential reads results:");
console.table(sequentialReadsResults);

console.log("\nArray random reads results:");
console.table(randomReadsResults);

function createTests(dim) {
    return [
        {
            method: methodNames.new,
            dim1: 1,
            dim2: dim * dim
        },
        {
            method: methodNames.new,
            dim1: dim,
            dim2: dim
        },
        {
            method: methodNames.push,
            dim1: 1,
            dim2: dim * dim
        },
        {
            method: methodNames.push,
            dim1: dim,
            dim2: dim
        }
    ]
}

function result(method, dim3, dim1, dim2, nbOperations, duration) {
    return {
        [columnDisplayNames.name]: method,
        [columnDisplayNames.dimensions]: `${dim3}x${dim1}x${dim2}`,
        [columnDisplayNames.ops]: Number((nbOperations / (duration * 1000)).toFixed(2)),
        [columnDisplayNames.elements]: nbOperations
    }
}

function byHighestOps(a, b) {
    if (a[columnDisplayNames.ops] < b[columnDisplayNames.ops]) {
        return 1;
      }
      if (a[columnDisplayNames.ops] > b[columnDisplayNames.ops]) {
        return -1;
      }
      
      return 0;
}

function timeArrayCreation(arrayCreator) {
    let startTime = new Date();
    const array = arrayCreator();
    const duration = new Date() - startTime;

    return [duration, array];
}

function timeArraySequentialReads(array3D) {
    const maxI = array3D.length;
    const maxJ = array3D[0].length;
    const maxK = array3D[0][0].length;
    let value = 0;

    let startTime = new Date();
    for (let i = 0; i < maxI; i++) {
        for (let j = 0; j < maxJ; j++) {
            for (let k = 0; k < maxK; k++) {
                value = array3D[i][j][k];
            }
        }
    }

    return new Date() - startTime;
}

function timeArrayRandomReads(array3D) {
    const maxI = array3D.length;
    const maxJ = array3D[0].length;
    const maxK = array3D[0][0].length;
    let value = 0;

    const randomIndices = [
        createVectorUsingNew(maxI, () => getRandom(maxI - 1)),
        createVectorUsingNew(maxJ, () => getRandom(maxJ - 1)),
        createVectorUsingNew(maxK, () => getRandom(maxK - 1)),
    ]

    let startTime = new Date();
    for (let i = 0; i < maxI; i++) {
        for (let j = 0; j < maxJ; j++) {
            for (let k = 0; k < maxK; k++) {                
                const randomI = randomIndices[0][i];
                const randomJ = randomIndices[1][j];
                const randomK = randomIndices[2][k];

                value = array3D[randomI][randomJ][randomK];
            }
        }
    }

    return new Date() - startTime;
}

function getRandom(max) {
    return Math.round(Math.random() * max);
}

function createVectorUsingNewNoGen(arrayDim, value) {
    return new Array(arrayDim).fill(value);
}

function createVectorUsingPushNoGen(arrayDim, value) {
    const usingPush = [];
    for (let i = 0; i < arrayDim; i++) {
        usingPush.push(value);
    }

    return usingPush
}

function createVectorUsingNew(arrayDim, generator) {
    return new Array(arrayDim).fill(0).map(generator);
}

function createVectorUsingPush(arrayDim, generator) {
    const usingPush = [];
    for (let i = 0; i < arrayDim; i++) {
        usingPush.push(generator());
    }

    return usingPush
}

function createMatrixUsingNew(i, j, k, generator) {
    return createVectorUsingNew(i, () => createVectorUsingNew(j, () => createVectorUsingNew(k, generator)));
}

function createMatrixUsingPush(i, j, k, generator) {
    return createVectorUsingPush(i, () => createVectorUsingPush(j, () => createVectorUsingPush(k, generator)));
}