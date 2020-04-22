"use strict";
//tutorial from https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/
exports.__esModule = true;
var PubSubEvents;
(function (PubSubEvents) {
    PubSubEvents[PubSubEvents["STATECHANGE"] = 0] = "STATECHANGE";
})(PubSubEvents = exports.PubSubEvents || (exports.PubSubEvents = {}));
var PubSub = /** @class */ (function () {
    function PubSub() {
        //this.events = {};
    }
    PubSub.prototype.subscribe = function (event, callback) {
        var ctx = this;
        if (!ctx.events.hasOwnProperty(event)) { //if event not yet created, create it
            ctx.events[event] = [];
        }
        //todo: investigate why we are returning the new lenght of the callback list
        return this.events[event].push(callback); //push new callback into events
    };
    PubSub.prototype.publish = function (event, data) {
        if (data === void 0) { data = {}; }
        var ctx = this;
        if (!ctx.events.hasOwnProperty(event)) { //if event does not exist, do nothing
            return [];
        }
        return ctx.events[event].map(function (callback) { return callback(data); }); //evaluate all the events
    };
    return PubSub;
}());
exports["default"] = PubSub;
