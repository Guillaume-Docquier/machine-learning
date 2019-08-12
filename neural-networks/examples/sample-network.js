const { Sequential, Dense, ReLU } = require("../index.js");

console.log("Model from scratch...");
const model = Sequential();
model.add(Dense());
model.add(ReLU());
model.add(Dense());

model.print();
model.save("model.ai");

console.log("\nModel from file...");
const reloadedModel = Sequential();
reloadedModel.load("model.ai");
reloadedModel.print();