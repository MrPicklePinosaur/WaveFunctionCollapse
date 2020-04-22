import Store from "./store.js";

export var actions = {
    "setColor": function(state: any, payload: any) {
        state.color = payload;
    }
}