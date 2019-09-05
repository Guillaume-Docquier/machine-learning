const readline = require("readline");

function getClass(output) {
    let max = 0;
    let outputClass = 0;
    output.forEach((value, i) => {
        if (value > max) {
            max = value;
            outputClass = i;
        }
    });

    return outputClass;
}

function progress(text) {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(text);
}

module.exports = {
    getClass,
    progress
};