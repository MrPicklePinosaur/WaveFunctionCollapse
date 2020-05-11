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
            //sorted insert
            this.sortedInsertIntoEntropyStack(H, i);
        }
        this.collapseTile(0);
    }
    WaveFunction.prototype.waveFunctionCollapse = function () {
        var lowestEntropyInd = this.entropy_stack.unshift();
        //collapse tile
        this.collapseTile(lowestEntropyInd);
    };
    WaveFunction.prototype.collapseTile = function (position) {
        var _this = this;
        var possibleTiles = this.wavefunction[position];
        var possibilityStrip = [];
        possibleTiles.forEach(function (t) {
            var freq = _this.frequency[t];
            var newStripSegment = Utils_js_1.filledArray(t, freq);
            possibilityStrip = __spreadArrays(possibilityStrip, newStripSegment);
        });
        //choose random item on possibility strip
        var choice = possibilityStrip[Math.floor(Math.random() * possibilityStrip.length)];
        console.log(possibilityStrip);
        console.log(choice);
    };
    WaveFunction.prototype.propogate = function () {
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
