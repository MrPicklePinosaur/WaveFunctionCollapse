import Store from "../old/store/store";

import {actions} from "./actions.js";

export var store = new Store({
    actions: actions,
    state: {}
});