const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

const data1d = tf.tensor1d([0, 1, 2, 30, 4, 5, 6]);
const argMaxData1d = tf.argMax(data1d);
argMaxData1d.print();

const data2d = tf.tensor2d([
    [0, 1, 2, 30, 4, 5, 6],
    [0, 1, 2, 3, 40, 5, 6],
    [0, 1, 2, 3, 4, 50, 6],
    [0, 1, 2, 3, 4, 5, 60],
]);
const argMaxData2d = tf.argMax(data2d, 1);
argMaxData2d.print();