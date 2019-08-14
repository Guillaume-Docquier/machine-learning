const { Sequential, Dense, ReLU, Sigmoid } = require("../index.js");

console.log("Build a simple model and feed it some data");
const model = Sequential()
    .add(Dense(5, 5, ReLU()))
    .add(Dense(5, 3, Sigmoid()));

const randomData = [1, 0, 0, 0, 0];
console.log(model.feedForward(randomData));
//model.print();
model.save("model.ai");

console.log("\nLoad the model from file and feed it the same data (output should be the same as before)");
const reloadedModel = Sequential();
reloadedModel.load("model.ai");
console.log(reloadedModel.feedForward(randomData));
//reloadedModel.print();

console.log(`\nLet's train our model to recognize that it should predict class 0 for this input: ${randomData}`);
console.log("Start training");
for (let i = 0; i < 2000; i++) {
    reloadedModel.feedForward(randomData);
    reloadedModel.fit([1, 0, 0]);
}
console.log("Training done.");

console.log(`\nPredict ${randomData}`);
console.log(reloadedModel.feedForward(randomData));
console.log(`Class is ${reloadedModel.predict(randomData)}!`);

//reloadedModel.print();