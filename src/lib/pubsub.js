"use strict";
exports.__esModule = true;
var PubSubEvents;
(function (PubSubEvents) {
    PubSubEvents[PubSubEvents["STATECHANGE"] = 0] = "STATECHANGE";
})(PubSubEvents = exports.PubSubEvents || (exports.PubSubEvents = {}));
var PubSub = /** @class */ (function () {
    //events: Record<PubSubEvents,{(state: Object): void;}[]>;
    function PubSub() {
        //this.events[PubSubEvents.STATECHANGE] = [];
    }
    PubSub.prototype.subscribe = function (event, callback) {
        var self = this;
        if (!(event in self.events)) { //if event is not tracked
            self.events[event] = [];
        }
        self.events[event].push(callback);
    };
    PubSub.prototype.publish = function (event, state) {
        var self = this;
        self.events[event].forEach(function (callback) {
            callback(state);
        });
    };
    return PubSub;
}());
exports["default"] = PubSub;
