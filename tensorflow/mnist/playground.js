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