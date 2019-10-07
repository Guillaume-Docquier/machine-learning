const assert = require("assert");
const { ReplayMemory } = require("../src/utils.js");

describe("ReplayMemory", function() {
    it("Should add to buffer", function() {
        const size = 10;
        const replay = new ReplayMemory(size);
        for (let i = 0; i < size; i++) {
            replay.push(i);
            assert.strictEqual(replay.buffer[i], i);
        }
    });
});