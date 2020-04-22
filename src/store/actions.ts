import Store from "./store.js";

export default {
    "setColor": function(state: any, payload: any) {
        state['color'] = payload;
    }
}