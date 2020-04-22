"use strict";
exports.__esModule = true;
var pubsub_js_1 = require("../lib/pubsub.js");
var StoreStatus;
(function (StoreStatus) {
    StoreStatus[StoreStatus["RESTING"] = 0] = "RESTING";
    StoreStatus[StoreStatus["MUTATION"] = 1] = "MUTATION";
    StoreStatus[StoreStatus["ACTION"] = 2] = "ACTION";
})(StoreStatus = exports.StoreStatus || (exports.StoreStatus = {}));
var Store = /** @class */ (function () {
    function Store(params) {
        var ctx = this;
        ctx.actions = {};
        ctx.mutations = {};
        ctx.state = {};
        ctx.status = StoreStatus.RESTING; //what the store is currently doing
        ctx.events = new pubsub_js_1["default"]();
        //apply special modifiers based on params passed in
        if (params.hasOwnProperty('actions')) {
            ctx.actions = params.actions;
        }
        if (params.hasOwnProperty('mutations')) {
            ctx.mutations = params.mutations;
        }
        ctx.state = new Proxy((params.state || {}), {
            set: function (state, key, value) {
                state[key] = value;
                console.log("StateChange: " + key + " -> " + value);
                ctx.events.publish(pubsub_js_1.PubSubEvents.STATECHANGE, ctx.state); //notify all listeners
                if (ctx.status != StoreStatus.MUTATION) { //discourage setting state manually
                    console.warn("You should be using mutations to set " + key);
                }
                ctx.status = StoreStatus.RESTING;
                return true;
            }
        });
    }
    ;
    Store.prototype.dispatch = function (actionKey, payload) {
        var ctx = this;
        if (!ctx.actions.hasOwnProperty(actionKey)) {
            console.error("Action " + actionKey + " does not exist");
            return false;
        }
        console.groupCollapsed("Action: " + actionKey);
        ctx.status = StoreStatus.ACTION;
        ctx.actions[actionKey](ctx, payload);
        console.groupEnd();
        return true;
    };
    Store.prototype.commit = function (mutationKey, payload) {
        var ctx = this;
        if (!ctx.mutations.hasOwnProperty(mutationKey)) {
            console.error("Mutation " + mutationKey + " does not exist");
            return false;
        }
        ctx.status = StoreStatus.MUTATION;
        var newState = ctx.mutations[mutationKey](ctx.state, payload); //do something with the state
        ctx.state = Object.assign(ctx.state, newState);
        return true;
    };
    return Store;
}());
exports["default"] = Store;
