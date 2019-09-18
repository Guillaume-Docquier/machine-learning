const actions = {
    UP_LEFT: 0,
    UP: 1,
    UP_RIGHT: 2,
    LEFT: 3,
    STAY: 4,
    RIGHT: 5,
    DOWN_LEFT: 6,
    DOWN: 7,
    DOWN_RIGHT: 8
}

const actionEffects = {
    [actions.UP_LEFT]: { dx: -1, dy: -1 },
    [actions.UP]: { dx: 0, dy: -1 },
    [actions.UP_RIGHT]: { dx: 1, dy: -1 },
    [actions.LEFT]: { dx: -1, dy: 0 },
    [actions.STAY]: { dx: 0, dy: 0 },
    [actions.RIGHT]: { dx: 1, dy:0 },
    [actions.DOWN_LEFT]: { dx: -1, dy: 1 },
    [actions.DOWN]: { dx: 0, dy: 1 },
    [actions.DOWN_RIGHT]: { dx: 1, dy: 1 }
}

class BlobworldEnv {
    constructor(worldSize) {
        this.maxX = worldSize - 1;
        this.maxY = worldSize - 1;
        this.actionSpace = Object.keys(actionEffects).length;

        this.reset();
    }

    reset() {
        this.player = { x: -1, y: -1 };
        this.food = { x: -1, y: -1 };
        this.enemy = { x: -1, y: -1 };

        this.player = this._newRandomPos();
        this.food = this._newRandomPos();
        this.enemy = this._newRandomPos();

        return this.getObservation();
    }

    _newRandomPos() {
        let x = Math.round(Math.random() * this.maxX);
        let y = Math.round(Math.random() * this.maxY);

        const objects = [this.player, this.food, this.enemy];
        while (objects.some(object => object.x === x && object.y === y)) {
            x = Math.round(Math.random() * this.maxX);
            y = Math.round(Math.random() * this.maxY);
        }

        return { x, y }
    }

    getObservation() {
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

    step(action) {
        this._applyAction(action);

        const observation = this.getObservation();
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

        return { observation, reward, done };
    }

    _applyAction(action) {
        const { dx, dy } = actionEffects[action];

        this.player.x = Math.max(0, Math.min(this.player.x + dx, this.maxX));
        this.player.y = Math.max(0, Math.min(this.player.y + dy, this.maxY));
    }

    hasWon() {
        return this.player.x === this.food.x && this.player.y === this.food.y;
    }

    hasLost() {
        return this.player.x === this.enemy.x && this.player.y === this.enemy.y;
    }

    render() {
        for (let i = 0; i < this.maxX; i++) {
            let row = "";
            for (let j = 0; j < this.maxY; j++) {
                row += this._getCharAt(i, j);
            }
            console.log(row);
        }
    }

    _getCharAt(x, y) {
        if (this.food.x === x && this.food.y === y) {
            return "F";
        }
        
        if (this.enemy.x === x && this.enemy.y === y) {
            return "E";
        }
        
        if (this.player.x === x && this.player.y === y) {
            return "P";
        }

        return " ";
    }

    close() {
        return null;
    }
}

module.exports = {
    BlobworldEnv: (...args) => new BlobworldEnv(...args),
    actions
}