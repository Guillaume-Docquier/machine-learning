const { BlobworldEnv, actions } = require("../../../environments/blobworld/env");
const { Sequential } = require("../../../neural-networks/src");

const saveFileName = "blobworld-dqn.ai";
const env = BlobworldEnv(10);
env.player = { x: 5, y: 5 };
env.food = { x: 9, y: 9 };
env.enemy = { x: 8, y: 9 };

const model = Sequential().load(saveFileName);

let observation = env.getObservation();
env.render();

for (let i = 0; i < 5; i++) {
    console.log(observation);
    const action = model.predict(observation);
    const qs = model.feedForward(observation).output;
    const state = env.step(action);
    observation = state.observation;

    const qTable = [
        { vertical: "UP", LEFT: qs[actions.UP_LEFT], CENTER: qs[actions.UP], RIGHT: qs[actions.UP_RIGHT] },
        { vertical: "MIDDLE", LEFT: qs[actions.LEFT], CENTER: qs[actions.STAY], RIGHT: qs[actions.RIGHT] },
        { vertical: "DOWN", LEFT: qs[actions.DOWN_LEFT], CENTER: qs[actions.DOWN], RIGHT: qs[actions.DOWN_RIGHT] }
    ];

    console.table(qTable);
    env.render();
}