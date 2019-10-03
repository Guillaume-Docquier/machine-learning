const assert = require("assert");
const { BlobworldEnv, actions } = require("../env");

const PLAYER_X = 2;
const PLAYER_Y = 3;

// TODO Fix tests, changed observation to not include boundaries and normalized output

describe("Blobworld environment", function() {
    it("Should handle step right", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.RIGHT;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];
            assert(currentX < worldSize, `Player went over the world X limits`);
            assert(currentX >= 0, `Player went under the world Y limits`);
            assert(currentY < worldSize, `Player went over the world Y limits`);
            assert(currentY >= 0, `Player went under the world Y limits`);
            assert(currentX === previousPos.x + 1 || currentX === worldSize - 1, `Player did not move on the X axis: ${currentX}, ${previousPos.x}, ${worldSize}`);
            assert(currentY === previousPos.y, `Player moved on the Y axis`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should handle step left", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.LEFT;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];

            assert(currentX < worldSize, `Player went over the world X limits`);
            assert(currentX >= 0, `Player went under the world Y limits`);
            assert(currentY < worldSize, `Player went over the world Y limits`);
            assert(currentY >= 0, `Player went under the world Y limits`);
            assert(currentX === previousPos.x - 1 || currentX === 0, `Player did not move on the X axis: ${currentX}, ${previousPos.x}, ${worldSize}`);
            assert(currentY === previousPos.y, `Player moved on the Y axis`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should handle step up", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.UP;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];

            assert(currentX < worldSize, `Player went over the world X limits`);
            assert(currentX >= 0, `Player went under the world Y limits`);
            assert(currentY < worldSize, `Player went over the world Y limits`);
            assert(currentY >= 0, `Player went under the world Y limits`);
            assert(currentX === previousPos.x, `Player moved on the X axis`);
            assert(currentY === previousPos.y - 1 || currentY === 0, `Player did not move on the Y axis: ${currentY}, ${previousPos.y}, ${worldSize}`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should handle step down", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.DOWN;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];

            assert(currentX < worldSize, `Player went over the world X limits`);
            assert(currentX >= 0, `Player went under the world Y limits`);
            assert(currentY < worldSize, `Player went over the world Y limits`);
            assert(currentY >= 0, `Player went under the world Y limits`);
            assert(currentX === previousPos.x, `Player moved on the X axis`);
            assert(currentY === previousPos.y + 1 || currentY === worldSize - 1, `Player did not move on the Y axis: ${currentY}, ${previousPos.y}, ${worldSize}`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should handle step up left", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.UP_LEFT;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];

            assert(currentX < worldSize, `Player went over the world X limits`);
            assert(currentX >= 0, `Player went under the world Y limits`);
            assert(currentY < worldSize, `Player went over the world Y limits`);
            assert(currentY >= 0, `Player went under the world Y limits`);
            assert(currentX === previousPos.x - 1 || currentX === 0, `Player did not move on the X axis: ${currentX}, ${previousPos.x}, ${worldSize}`);
            assert(currentY === previousPos.y - 1 || currentY === 0, `Player did not move on the Y axis: ${currentY}, ${previousPos.y}, ${worldSize}`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should handle step up right", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.UP_RIGHT;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];

            assert(currentX < worldSize, `Player went over the world X limits`);
            assert(currentX >= 0, `Player went under the world Y limits`);
            assert(currentY < worldSize, `Player went over the world Y limits`);
            assert(currentY >= 0, `Player went under the world Y limits`);
            assert(currentX === previousPos.x + 1 || currentX === worldSize - 1, `Player did not move on the X axis: ${currentX}, ${previousPos.x}, ${worldSize}`);
            assert(currentY === previousPos.y - 1 || currentY ===0, `Player did not move on the Y axis: ${currentY}, ${previousPos.y}, ${worldSize}`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should handle step down left", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.DOWN_LEFT;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];

            assert(currentX < worldSize, `Player went over the world X limits`);
            assert(currentX >= 0, `Player went under the world Y limits`);
            assert(currentY < worldSize, `Player went over the world Y limits`);
            assert(currentY >= 0, `Player went under the world Y limits`);
            assert(currentX === previousPos.x - 1 || currentX ===0, `Player did not move on the X axis: ${currentX}, ${previousPos.x}, ${worldSize}`);
            assert(currentY === previousPos.y + 1 || currentY === worldSize - 1, `Player did not move on the Y axis: ${currentY}, ${previousPos.y}, ${worldSize}`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should handle step down right", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.DOWN_RIGHT;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];

            assert(currentX < worldSize, `Player went over the world X limits`);
            assert(currentX >= 0, `Player went under the world Y limits`);
            assert(currentY < worldSize, `Player went over the world Y limits`);
            assert(currentY >= 0, `Player went under the world Y limits`);
            assert(currentX === previousPos.x + 1 || currentX === worldSize - 1, `Player did not move on the X axis: ${currentX}, ${previousPos.x}, ${worldSize}`);
            assert(currentY === previousPos.y + 1 || currentY === worldSize - 1, `Player did not move on the Y axis: ${currentY}, ${previousPos.y}, ${worldSize}`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should handle step stay", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        const direction = actions.STAY;
        let previousPos = { ...env.player };
        for (let i = 0; i < 2 * worldSize; i++) {
            const { observation } = env.step(direction);
            const currentX = observation[PLAYER_X];
            const currentY = observation[PLAYER_Y];

            assert(currentX === previousPos.x, `Player moved on the X axis`);
            assert(currentY === previousPos.y, `Player moved on the Y axis`);

            previousPos = { x: currentX, y: currentY };
        }
    });

    it("Should reward and terminate when you win", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        env.enemy = { x: 3, y: 3 };
        env.player = { x: 4, y: 4 };
        env.food = { x: 5, y: 5 };

        const { reward, done } = env.step(actions.DOWN_RIGHT);
        assert(reward > 0, "The reward was not positive");
        assert(done, "The simulation should have ended");
    });

    it("Should punish and terminate when you lose", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        env.food = { x: 3, y: 3 };
        env.player = { x: 4, y: 4 };
        env.enemy = { x: 5, y: 5 };

        const { reward, done } = env.step(actions.DOWN_RIGHT);
        assert(reward < -1, "The reward was not highly negative");
        assert(done, "The simulation should have ended");
    });

    it("Should punish on each step until the end", function() {
        const worldSize = 10;
        const env = BlobworldEnv(worldSize);

        env.food = { x: 0, y: 0 };
        env.player = { x: 1, y: 1 };
        env.enemy = { x: 6, y: 6 };


        const nbSteps = env.enemy.x - env.player.x - 1;
        for (let i = 0; i < nbSteps; i++) {
            const { reward, done } = env.step(actions.DOWN_RIGHT);
            assert(reward < 0, "The reward was not negative");
            assert(!done, "The simulation should not have ended");
        }
    });
});