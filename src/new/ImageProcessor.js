"use strict";
exports.__esModule = true;
/*JOB is to take in an input sprite and return:
    - an indexed (simplified) input image, along with a tiletable for easy lookup
    - adjacency rules
    - frequency hints
*/
var Utils_js_1 = require("./Utils.js");
var ImageProcessor = /** @class */ (function () {
    function ImageProcessor(pixels, width, height, sliceWidth, sliceHeight) {
        //include options like wrapping
        //outputs
        this.indexedSprite = new Array();
        this.index_table = new Array(); //index in array corresponds to tile index
        this.inputSprite = pixels;
        this.inputWidth = width;
        this.inputHeight = height;
        this.sliceWidth = sliceWidth;
        this.sliceHeight = sliceHeight;
        this.indexInputImage();
    }
    ImageProcessor.prototype.indexInputImage = function () {
        for (var i = 0; i < this.inputSprite.length; i++) {
            //get a subsprite
            var subSprite = this.getSubSprite(i, true);
            //check to see if it is already in the index table
            var ind = Utils_js_1.findNestedArray(this.index_table, subSprite);
            if (ind == -1) { //if no, add new entry to index_table
                this.index_table.push(subSprite);
                ind = this.index_table.length - 1;
            }
            this.indexedSprite[i] = ind; //update indexedSprite
        }
    };
    ImageProcessor.prototype.calculateAdjacencyRules = function () {
        /*format: array where the array index is the tile index
            stores a dict of DIRECTION: array
                array contains all tiles this tile enables in that direction
        */
        var _this = this;
        //var adjacency = new Array<Record<Direction,Array<number>>>(this.index_table.length);
        var adjacency = [];
        for (var i = 0; i < this.index_table.length; i++) {
            adjacency.push({
                "RIGHT": new Array(0),
                "LEFT": new Array(0),
                "DOWN": new Array(0),
                "UP": new Array(0)
            });
        }
        for (var i = 0; i < this.indexedSprite.length; i++) {
            var curTile = this.indexedSprite[i];
            //look in every direction and compute enablers
            var newInds = Utils_js_1.getIndiciesAround(i, this.inputWidth, this.inputHeight, true); //REPLACE THIS LATER
            Object.keys(newInds).forEach(function (dir) {
                var newInd = newInds[dir];
                //each tile is going to store it's enablers, instead of the tiles it enables
                var newTileIndex = _this.indexedSprite[newInd];
                if (adjacency[curTile][dir].indexOf(newTileIndex) == -1) {
                    adjacency[curTile][dir].push(newTileIndex);
                }
            });
        }
        return adjacency;
    };
    ImageProcessor.prototype.calculateFrequencyHints = function () {
        //format: index of array is tile index, array stores occurences of each tile
        var frequency = new Array();
        for (var i = 0; i < this.index_table.length; i++) {
            frequency.push(0);
        }
        this.indexedSprite.forEach(function (t) {
            //count number of times each tile comes up
            frequency[t] += 1;
        });
        return frequency;
    };
    //helpers
    ImageProcessor.prototype.getSubSprite = function (index, wrapping) {
        var subSprite = new Array();
        var curIndex = index;
        for (var j = 0; j < this.sliceHeight; j++) {
            var rowInd = curIndex; //save the position of the beginning of the row
            for (var i = 0; i < this.sliceWidth; i++) {
                subSprite.push(this.inputSprite[curIndex]);
                //shift to the right
                curIndex = Utils_js_1.getIndexInDirection(curIndex, this.inputWidth, this.inputHeight, "RIGHT", wrapping);
                if (curIndex == -1) {
                    console.error("Invalid Subsprite");
                }
            }
            if (j < this.sliceHeight - 1) { //dont go down of the final pass (bad solution for now)
                //go down a layer
                curIndex = Utils_js_1.getIndexInDirection(rowInd, this.inputWidth, this.inputHeight, "DOWN", wrapping);
                if (curIndex == -1) {
                    console.error("Invalid Subsprite");
                }
            }
        }
        return subSprite;
    };
    return ImageProcessor;
}());
exports["default"] = ImageProcessor;
