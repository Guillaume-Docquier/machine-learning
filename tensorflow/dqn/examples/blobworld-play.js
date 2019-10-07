const { BlobworldEnv } = require("../../../environments");
const { Sequential } = require("../../../neural-networks/src");

const saveFileName = "blobworld-dqn.ai";
const env = BlobworldEnv(10);

const model = Sequential().load(saveFileName);

let done = false;
let observation = env.reset();
while(!done) {
    const action = model.predict(observation);
    const state = env.step(action);
    
    observation = state.observation;
    done = state.done;

    env.render();
}