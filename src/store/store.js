"use strict";
exports.__esModule = true;
var pubsub_js_1 = require("../lib/pubsub.js");
var Store = /** @class */ (function () {
    function Store(params) {
        if (params === void 0) { params = {}; }
        var self = this;
        self.pubsub = new pubsub_js_1["default"]();
        self.actions = (params.actions || {});
        self.state = new Proxy((params.state || {}), {
            set: function (target, key, value) {
                target[key] = value;
                //NOTE: we do not want to be setting state manually, so possibly add a protection against that
                self.pubsub.publish(pubsub_js_1.PubSubEvents.STATECHANGE, self.state);
                return true;
            }
        });
    }
    Store.prototype.dispatch = function (actionName, payload) {
        var self = this;
        if (!(actionName in self.actions)) {
            console.warn(actionName + " is not a defined action");
            return;
        }
        var newState = self.actions[actionName](self.state, payload);
        self.state = Object.assign(self.state, newState);
    };
    return Store;
}());
exports["default"] = Store;
