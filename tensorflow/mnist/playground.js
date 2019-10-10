const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const data1d = tf.tensor1d([0, 1, 2, 30, 4, 5, 6]);
const argMaxData1d = data1d.argMax();
console.log(argMaxData1d.dataSync());

const data2d = [
    [0, 1, 2, 30, 4, 5, 6],
    [0, 1, 2, 3, 40, 5, 6],
    [0, 1, 2, 3, 4, 50, 6],
    [0, 1, 2, 3, 4, 5, 60],
];

console.log(tf.tensor2d(data2d).argMax(1).dataSync());

console.log(`NbTensors before chain: ${tf.memory().numTensors}`);
const chainTensor = tf.tensor2d(data2d).argMax(1).sum();
const chainData = chainTensor.dataSync();
chainTensor.dispose();
console.log(`NbTensors after chain: ${tf.memory().numTensors}`);

console.log(`NbTensors before no-chain: ${tf.memory().numTensors}`);
const noChainTensor = tf.tensor2d(data2d);
const noChainArgMaxTensor = noChainTensor.argMax(1);
const noChainSumTensor = noChainArgMaxTensor.sum();
const noChainData = noChainSumTensor.dataSync();
noChainTensor.dispose();
noChainArgMaxTensor.dispose();
noChainSumTensor.dispose();
console.log(`NbTensors after no-chain: ${tf.memory().numTensors}`);

console.log(`NbTensors before tidy chain: ${tf.memory().numTensors}`);
const tidyData = tf.tidy(() => tf.tensor2d(data2d).argMax(1).sum().dataSync()[0]);
console.log(tidyData);
console.log(`NbTensors after tidy chain: ${tf.memory().numTensors}`);