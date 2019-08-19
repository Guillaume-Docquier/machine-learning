const utils = require("../src/utils.js");

const methodNames = {
    new: "new",
    push: "push"
}

const tests = [];

let dim = 0;
for (let i = 0; i < 10; i++) {
    dim += 100
    tests.push(
        {
            method: methodNames.new,
            dim1: 1,
            dim2: dim * dim
        },
        {
            method: methodNames.push,
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
            dim1: dim,
            dim2: dim
        },
    );
}

tests.push(
    {
        method: methodNames.new,
        dim1: 1,
        dim2: 10 * 10
    },
    {
        method: methodNames.new,
        dim1: 10,
        dim2: 10
    },
    {
        method: methodNames.push,
        dim1: 1,
        dim2: 10 * 10
    },
    {
        method: methodNames.push,
        dim1: 10,
        dim2: 10
    }
);

const arrayCreationMethods = {
    [methodNames.new]: createMatrixUsingNew,
    [methodNames.push]: createMatrixUsingPush
}

const columnDisplayNames = {
    name: "Method",
    dimensions: "Dimensions",
    elements: "Number of elements",
    ops: "Ops per μs"
}

console.log("Benchmarking the creation of 50.000.000 elements");

const generator = Math.random;
const targetNbElements = 50000000;
const results = [];
for (let i = 0; i < tests.length; i++) {
    const { method, dim1, dim2 } = tests[i];
    const iterations = Math.round(targetNbElements / dim1 / dim2);
    const nbElements = iterations * dim1 * dim2;

    utils.progress(`Test ${i + 1} of ${tests.length}`);
    const duration = timeArrayCreation(
        iterations, 
        () => arrayCreationMethods[method](dim1, dim2, generator)
    );

    results.push({
        [columnDisplayNames.name]: method,
        [columnDisplayNames.dimensions]: `${dim1}x${dim2}`,
        [columnDisplayNames.ops]: Number((nbElements / (duration * 1000)).toFixed(2)),
        [columnDisplayNames.elements]: nbElements
    });
}

results.sort(byHighestOps);

console.log("\n");
console.table(results);

function byHighestOps(a, b) {
    if (a[columnDisplayNames.ops] < b[columnDisplayNames.ops]) {
        return 1;
      }
      if (a[columnDisplayNames.ops] > b[columnDisplayNames.ops]) {
        return -1;
      }
      
      return 0;
}

function timeArrayCreation(iterations, arrayCreator) {
    let startTime = new Date();
    for (let i = 0; i < iterations; i++) {
        const array = arrayCreator();
    }
    const duration = new Date() - startTime;

    return duration;
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

function createMatrixUsingNew(i, j, generator) {
    return createVectorUsingNew(i, () => createVectorUsingNew(j, generator));
}

function createMatrixUsingPush(i, j, generator) {
    return createVectorUsingPush(i, () => createVectorUsingPush(j, generator));
}