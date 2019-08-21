const { Sequential, Dense, ReLU, Sigmoid, SGD } = require("../src");
const utils = require("../src/utils.js");

const intputSize = 700;
const hiddenLayerSize = 300;
const outputSize = 8;

const randomData = utils.generatorFilledArray(intputSize, Math.random);
const expectedOutput = utils.valueFilledArray(outputSize, 0);
const expectedClass = 2;
expectedOutput[expectedClass] = 1;

console.log("Build a simple model and feed it some data");
const model = Sequential({ optimizer: SGD({ learningRate: 0.2 }) })
    .add(Dense(intputSize,            hiddenLayerSize,       ReLU()))
    .add(Dense(hiddenLayerSize,       hiddenLayerSize,       ReLU()))
    .add(Dense(hiddenLayerSize,       hiddenLayerSize - 100, ReLU()))
    .add(Dense(hiddenLayerSize - 100, hiddenLayerSize,       ReLU()))
    .add(Dense(hiddenLayerSize,       hiddenLayerSize - 200, Sigmoid()))
    .add(Dense(hiddenLayerSize - 200, hiddenLayerSize,       Sigmoid()))
    .add(Dense(hiddenLayerSize,       outputSize,            Sigmoid()));

//console.log(model.feedForward(randomData));
model.save("sample.ai");

console.log("\nLoad the model from file and feed it the same data (output should be the same as before)");
const reloadedModel = Sequential().load("sample.ai");
//console.log(reloadedModel.feedForward(randomData));

console.log(`\nLet's train our model to recognize that it should predict class ${expectedClass}`);
console.log("Start training");
reloadedModel.train([{input: randomData, output: expectedOutput}], 100);
console.log("Training done.");

console.log(`\nPredict`);
const outputClass = reloadedModel.predict(randomData);
console.log(`Class is ${outputClass}!`);

reloadedModel.save("sample.ai");