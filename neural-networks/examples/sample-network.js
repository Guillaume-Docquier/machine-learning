const { Sequential, Dense, ReLU } = require("../index.js");

console.log("Model from scratch...");
const model = Sequential()
    .add(Dense(5, 3))
    .add(ReLU())
    .add(Dense(3, 1));

model.print();
model.save("model.ai");

console.log("\nModel from file...");
const reloadedModel = Sequential();
reloadedModel.load("model.ai");
reloadedModel.print();