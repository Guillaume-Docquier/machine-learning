const fs = require("fs");

class Sequential {
    constructor() {
        this.layers = [];
    }

    add(layer) {
        this.layers.push(layer);
    }

    print() {
        this.layers.forEach(console.log);
    }

    save(filePath) {
        fs.writeFileSync(filePath, JSON.stringify(this.layers), handleWriteError);
    }

    load(filePath) {
        const data = fs.readFileSync(filePath, 'utf8');
        this.layers = JSON.parse(data);
    }
};

function handleWriteError(error) {
    if (error) {
        throw error;
    }
}

module.exports = args => new Sequential(args);
