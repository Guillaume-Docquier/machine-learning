const { Sequential, Dense, ReLU, Sigmoid } = require("../index.js");

console.log("Model from scratch...");
const model = Sequential()
    .add(Dense(5, 3, ReLU()))
    .add(Dense(3, 3, Sigmoid()));

const randomData = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
console.log(model.feedForward(randomData));
//model.print();
model.save("model.ai");

console.log("\nModel from file...");
const reloadedModel = Sequential();
reloadedModel.load("model.ai");
console.log(reloadedModel.feedForward(randomData));
//reloadedModel.print();