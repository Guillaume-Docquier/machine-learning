const UP_LEFT      = 0;
const UP           = 1;
const UP_RIGHT     = 2;
const LEFT         = 3;
const STAY         = 4;
const RIGHT        = 5;
const BOTTOM_LEFT  = 6;
const BOTTOM       = 7;
const BOTTOM_RIGHT = 8;

const actions = [
    UP_LEFT,
    UP,
    UP_RIGHT,
    LEFT,
    STAY,
    RIGHT, 
    BOTTOM_LEFT,
    BOTTOM,
    BOTTOM_RIGHT
]

class BlobworldEnv {
    constructor(worldSize) {
        this.maxX = worldSize - 1;
        this.maxY = worldSize - 1;
        this.actionSpace = actions.length;

        this.reset();
    }

    reset() {
        this.steps = [];
        this.player = { x: -1, y: -1 };
        this.food = { x: -1, y: -1 };
        this.enemy = { x: -1, y: -1 };

        this.player = this.newRandomPos();
        this.food = this.newRandomPos();
        this.enemy = this.newRandomPos();

        return this.getState();
    }

    newRandomPos() {
        let x = Math.random() * this.maxX;
        let y = Math.random() * this.maxY;

        const objects = [this.player, this.food, this.enemy];
        while (objects.some(object => object.x === x && object.y === y)) {
            x = Math.random() * this.maxX;
            y = Math.random() * this.maxY;
        }

        return { x, y }
    }

    getState() {
        return [
            this.maxX,
            this.maxY,
            this.player.x,
            this.player.y,
            this.food.x,
            this.food.y,
            this.enemy.x,
            this.enemy.y,
        ];
    }

    step() {
        const observation = this.getState();
        let reward = -1;
        let done = false

        if (this.hasWon()) {
            reward = 200;
            done = true
        }

        if (this.hasLost()) {
            reward = -200;
            done = true
        }

        this.steps.push(observation);

        return { observation, reward, done };
    }

    hasWon() {
        return this.player.x === this.food.x && this.player.y === this.food.y;
    }

    hasLost() {
        return this.player.x === this.enemy.x && this.player.y === this.enemy.y;
    }

    render() {
        return null;
    }

    close() {
        return null;
    }
}

module.exports = {
    BlobworldEnv: (...args) => new BlobworldEnv(...args),
}