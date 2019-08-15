const { Sequential, Dense, ReLU, Sigmoid } = require("../index.js");
const utils = require("../utils.js");

const intputSize = 700;
const hiddenLayerSize = 300;
const outputSize = 8;

const randomData = utils.filledArray(intputSize, () => Math.random());
const expectedOutput = utils.filledArray(outputSize, () => 0);
const expectedClass = 2;
expectedOutput[expectedClass] = 1;

console.log("Build a simple model and feed it some data");
const model = Sequential()
    .add(Dense(intputSize, hiddenLayerSize, ReLU()))
    .add(Dense(hiddenLayerSize, hiddenLayerSize, ReLU()))
    .add(Dense(hiddenLayerSize, hiddenLayerSize, ReLU()))
    .add(Dense(hiddenLayerSize, hiddenLayerSize, ReLU()))
    .add(Dense(hiddenLayerSize, hiddenLayerSize, Sigmoid()))
    .add(Dense(hiddenLayerSize, hiddenLayerSize, Sigmoid()))
    .add(Dense(hiddenLayerSize, outputSize, Sigmoid()));

console.log(model.feedForward(randomData));
//model.print();
model.save("sample.ai");

console.log("\nLoad the model from file and feed it the same data (output should be the same as before)");
const reloadedModel = Sequential(1);
reloadedModel.load("sample.ai");
console.log(reloadedModel.feedForward(randomData));
//reloadedModel.print();

console.log(`\nLet's train our model to recognize that it should predict class ${expectedClass}`);
console.log("Start training");
for (let i = 0; i < 100; i++) {
    reloadedModel.feedForward(randomData);
    reloadedModel.fit(expectedOutput);
}
console.log("Training done.");

console.log(`\nPredict`);
const output = reloadedModel.feedForward(randomData)
const outputClass = utils.getClass(output);
console.log(output);
console.log(`Class is ${outputClass}!`);

reloadedModel.save("sample.ai");