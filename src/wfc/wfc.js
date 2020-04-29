"use strict";
exports.__esModule = true;
var sprite_js_1 = require("./sprite.js");
var WFC = /** @class */ (function () {
    //entropy_cache: Array<number>; //an array that stores the entropy of every cell
    function WFC(sprite, sliceWidth, sliceHeight, outputWidth, outputHeight) {
        this.sprite = sprite;
        this.sliceWidth = sliceWidth;
        this.sliceHeight = sliceHeight;
        this.outputWidth = outputWidth;
        this.outputHeight = outputHeight;
        this.tile_table = [];
        this.adjacency = [];
        this.outputTiles = new Array(this.outputWidth * this.outputHeight);
        //this.entropy_cache = new Array<number>(this.outputWidth*this.outputHeight);
    }
    //gets all enumerations of the main sprite and indexes each subsprite as well as generating adjacncy rules for each subsprite
    WFC.prototype.imageProcessor = function () {
        this.indexed_sprite = new Array(this.sprite.width * this.sprite.height);
        for (var j = 0; j < this.sprite.height; j++) {
            for (var i = 0; i < this.sprite.width; i++) {
                var curPixelIndex = this.getPixelIndexAtPosition(i, j);
                //GENERATE frequency hits =-=-=-=-=-=-=-=-=
                var dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
                for (var d = 0; d < dirs.length; d++) { //for each valid direction
                    var dir = dirs[d];
                    var newPos = [i + dir[0], j + dir[1]];
                    //wrap back around
                    if (newPos[0] < 0) {
                        newPos[0] += this.sprite.width;
                    }
                    else if (newPos[0] > this.sprite.width - 1) {
                        newPos[0] -= this.sprite.width;
                    }
                    if (newPos[1] < 0) {
                        newPos[1] += this.sprite.height;
                    }
                    else if (newPos[1] > this.sprite.height - 1) {
                        newPos[1] -= this.sprite.height;
                    }
                    var newPixelIndex = this.getPixelIndexAtPosition(newPos[0], newPos[1]);
                    //add frequency hint to curPixel's dict of frequncy hints
                    //check if the newPixel has already been hit before
                    if (this.adjacency[curPixelIndex][d][newPixelIndex] == null) {
                        //if not, set the hit count to 1
                        this.adjacency[curPixelIndex][d][newPixelIndex] = 1;
                    }
                    else {
                        //otherwise increment
                        this.adjacency[curPixelIndex][d][newPixelIndex] += 1;
                    }
                }
            }
        }
    };
    //HELPER METHODS
    WFC.prototype.getPixelIndex = function (pixels) {
        var index = -1;
        for (var c = 0; c < this.tile_table.length; c++) {
            if (sprite_js_1["default"].compare(pixels, this.tile_table[c])) {
                index = c; //grab the index of the tile
                break;
            }
        }
        //if the pixel pattern was not found, add it
        if (index == -1) {
            this.tile_table.push(pixels);
            this.adjacency.push([{}, {}, {}, {}]); //don't forget to also add a new entry in adjacency hints
            index = this.tile_table.length - 1; //set the current index as the last position
        }
        return index; //return index of -1 if not found
    };
    WFC.prototype.getPixelIndexAtPosition = function (x, y) {
        if (this.indexed_sprite == null) {
            console.warn("indexed_sprite array not initialized yet!!");
        }
        //check if the tile at position (x,y) has been indexed yet
        var pos = x + y * this.sprite.width;
        if (this.indexed_sprite[pos] == null) {
            //if it hasnt been indexed, index it and then return
            var subSprite = this.sprite.slice(x, y, this.sliceWidth, this.sliceHeight);
            var pixelIndex = this.getPixelIndex(subSprite);
            this.indexed_sprite[pos] = pixelIndex;
            return pixelIndex;
        }
        //if it has already been indexed, just return the index/id of the tile
        return this.indexed_sprite[pos];
    };
    WFC.prototype.computeFrequencyHints = function () {
        //this.frequency = new Array<number>(this.tile_table.length).fill(0);
        //this.frequency = Array.from({length: this.tile_table.length}, (v,k) => 0);
        var _this = this;
        this.frequency = new Array(this.tile_table.length);
        //fill the array with 0, find an actual way to do this later
        for (var i = 0; i < this.frequency.length; i++) {
            this.frequency[i] = 0;
        }
        this.indexed_sprite.forEach(function (element) {
            _this.frequency[element] += 1;
        });
    };
    WFC.prototype.collapse = function () {
        //assume every single tile can appear anywhere at first
        for (var i = 0; i < this.outputTiles.length; i++) {
            var possibleTiles = new Array(this.tile_table.length);
            for (var p = 0; p < possibleTiles.length; p++) {
                possibleTiles[p] = p;
            }
            this.outputTiles[i] = possibleTiles;
        }
    };
    WFC.prototype.calculateEntropyAt = function (x, y) {
        var possibleTiles = this.outputTiles[x + y * this.sprite.width];
        var entropy = 0;
        var W = this.indexed_sprite.length; //W is total weight
        possibleTiles.forEach(function (w) {
            entropy += w * WFC.logb2(w);
        });
        entropy = -1 / W + WFC.logb2(W);
        return entropy;
    };
    WFC.logb2 = function (x) {
        return Math.log(x) / Math.log(2);
    };
    return WFC;
}());
exports["default"] = WFC;
