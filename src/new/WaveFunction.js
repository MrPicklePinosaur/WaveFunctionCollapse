"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var Utils_js_1 = require("./Utils.js");
var WaveFunction = /** @class */ (function () {
    function WaveFunction(outputWidth, outputHeight, index_table, frequency, adjacency) {
        this.entropy_stack = []; //sorted array from lowest to highest entropy format
        this.outputWidth = outputWidth;
        this.outputHeight = outputHeight;
        this.index_table = index_table;
        this.frequency = frequency;
        this.adjacency = adjacency;
        //prepopulate wavefunction
        this.wavefunction = new Array();
        var empty = [];
        for (var i = 0; i < this.index_table.length; i++) {
            empty[i] = i;
        }
        for (var i = 0; i < this.outputWidth * this.outputHeight; i++) {
            //every tile has the ability to be anywhere from the start
            this.wavefunction.push(__spreadArrays(empty));
        }
        //prepopulate entropy stack
        for (var i = 0; i < this.wavefunction.length; i++) {
            //calculate entropy and insert it sorted into entropy stack
            var H = this.calculateEntropy(this.wavefunction[i]);
            this.sortedInsertIntoEntropyStack(H, i);
        }
        //main algorithm
        /*
        while (this.entropy_stack.length > 0) {
        }
        */
        this.waveFunctionCollapse();
    }
    WaveFunction.prototype.waveFunctionCollapse = function () {
        var lowestEntropyInd = this.entropy_stack.shift().index; //find the lowest entropy tile to collapse
        //check to see if tile has already been collapsed
        if (this.wavefunction[lowestEntropyInd].length <= 1) {
            return;
        }
        this.collapseTile(lowestEntropyInd);
        //propogate effect
        var callback_queue = []; //holds positions of all functions to check enablers
        //prepopulate queue
        var indiciesAround = Utils_js_1.getIndiciesAround(lowestEntropyInd, this.outputWidth, this.outputHeight, false);
        var surrounding = Object.keys(indiciesAround).map(function (key) { return indiciesAround[key]; }); //pull indicies out
        callback_queue = __spreadArrays(surrounding);
        //while callback queue is not empty
        while (callback_queue.length > 0) {
            var ind = callback_queue.shift();
            //check enablers
            if (!this.checkEnablers(ind)) { //if something was invalid and removed, propogate again
                var indiciesAround = Utils_js_1.getIndiciesAround(ind, this.outputWidth, this.outputHeight, false);
                var surrounding = Object.keys(indiciesAround).map(function (key) { return indiciesAround[key]; }); //pull indicies out
                callback_queue = __spreadArrays(callback_queue, surrounding);
            }
        }
    };
    //chooses one possiblitiy based on frequency hints
    WaveFunction.prototype.collapseTile = function (position) {
        var _this = this;
        var possibilityStrip = [];
        this.wavefunction[position].forEach(function (t) {
            var freq = _this.frequency[t];
            var newStripSegment = Utils_js_1.filledArray(t, freq);
            possibilityStrip = __spreadArrays(possibilityStrip, newStripSegment);
        });
        //choose random item on possibility strip
        var choice = possibilityStrip[Math.floor(Math.random() * possibilityStrip.length)];
        this.wavefunction[position] = [choice];
    };
    //check enablers in four directions and remove any possibilities that are invalid
    WaveFunction.prototype.checkEnablers = function (position) {
        var _this = this;
        var indiciesAround = Utils_js_1.getIndiciesAround(position, this.outputWidth, this.outputHeight, false);
        //NOTE: we can loop backwards so removing items wont have an effect
        var toRemove = []; //all invalid tiles
        this.wavefunction[position].forEach(function (t) {
            var adj_data = _this.adjacency[t]; //get adjacency info on this specific tile type
            for (var _i = 0, _a = Object.keys(adj_data); _i < _a.length; _i++) {
                var dir = _a[_i];
                //if direction is not valid
                if (!indiciesAround.hasOwnProperty(dir)) {
                    continue;
                }
                //make sure at least one tile in each direction is possible in the wavefunction
                var nextTilePossiblities = _this.wavefunction[indiciesAround[dir]];
                //console.log(`adj data ${adj_data[dir]}`);
                //console.log(`tile possib ${nextTilePossiblities}`);
                if (nextTilePossiblities == null) {
                    console.log(indiciesAround);
                    console.log(adj_data);
                    console.log(dir);
                    console.log(indiciesAround[dir]);
                }
                if (!Utils_js_1.atLeastOneIn(adj_data[dir], nextTilePossiblities)) { //if invalid
                    toRemove.push(t);
                    break;
                }
            }
        });
        if (toRemove.length == 0) {
            return true;
        }
        //remove all invalid tiles
        for (var _i = 0, toRemove_1 = toRemove; _i < toRemove_1.length; _i++) {
            var t = toRemove_1[_i];
            var indToRemove = this.wavefunction[position].indexOf(t);
            this.wavefunction[position].splice(indToRemove, 1);
        }
        //update tile entropy
        var h = this.calculateEntropy(this.wavefunction[position]);
        this.sortedInsertIntoEntropyStack(h, position);
        //check to see if there are no items left
        if (this.wavefunction[position].length == 0) {
            //we hit a contradiction and have to restart
            console.error("WAVE FUNCTION COLLAPSE FAILED");
        }
        return false;
    };
    //helpers
    WaveFunction.prototype.calculateEntropy = function (possibilities) {
        var _this = this;
        var entropy = 0;
        var W = this.frequency.reduce(function (a, b) { return a + b; }, 0); //sum of all values
        possibilities.forEach(function (p) {
            var w = _this.frequency[p];
            entropy += w * Utils_js_1.logb2(w);
        });
        entropy = -1 / W * entropy + Utils_js_1.logb2(W);
        //add a tiny amount of noise to break any ties
        entropy += Math.random() / 1000000;
        return entropy;
    };
    WaveFunction.prototype.sortedInsertIntoEntropyStack = function (entropy, tile_index) {
        for (var i = 0; i < this.entropy_stack.length; i++) {
            var h = this.entropy_stack[i].entropy;
            if (entropy <= h) {
                this.entropy_stack.splice(i, 0, { entropy: entropy, index: tile_index });
                //console.log(`inserted ${entropy} at ${i}`);
                return;
            }
        }
        this.entropy_stack.push({ entropy: entropy, index: tile_index });
        //console.log(`inserted ${entropy} last`);
    };
    return WaveFunction;
}());
exports["default"] = WaveFunction;
