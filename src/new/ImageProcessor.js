"use strict";
/*JOB is to take in an input sprite and return:
    - an indexed (simplified) input image, along with a tiletable for easy lookup
    - adjacency rules
    - frequency hints
*/
exports.__esModule = true;
var ImageProcessor = /** @class */ (function () {
    function ImageProcessor(pixels, width, height, sliceWidth, sliceHeight) {
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
            //if no, add new entry to index_table
            //update indexedSprite
        }
    };
    ImageProcessor.prototype.calculateAdjacencyRules = function () {
        /*format: array where the array index is the tile index
            stores a dict of DIRECTION: array
                array contains all tiles this tile enables in that direction
        */
        var _this = this;
        var adjacency = new Array(this.index_table.length);
        ImageProcessor.fillArray(adjacency, {
            "RIGHT": new Array(),
            "LEFT": new Array(),
            "DOWN": new Array(),
            "UP": new Array()
        });
        for (var i = 0; i < this.indexedSprite.length; i++) {
            var curTile = this.indexedSprite[i];
            //look in every direction and compute enablers
            var newInds = ImageProcessor.getIndiciesAround(i, this.inputWidth, this.inputHeight, true); //REPLACE THIS LATER
            Object.keys(newInds).forEach(function (dir) {
                var newInd = newInds[dir];
                //each tile is going to store it's enablers, instead of the tiles it enables
                var newTileIndex = _this.indexedSprite[newInd];
                if (!adjacency[i][dir].contains(newTileIndex)) {
                    adjacency[i][dir].push(newTileIndex);
                }
            });
        }
        return adjacency;
    };
    ImageProcessor.prototype.calculateFrequencyHints = function () {
        //format: index of array is tile index, array stores occurences of each tile
        var frequency = new Array(this.index_table.length);
        ImageProcessor.fillArray(frequency, 0);
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
                curIndex = ImageProcessor.getIndexInDirection(curIndex, this.inputWidth, this.inputHeight, "RIGHT", wrapping);
                if (curIndex == -1) {
                    console.error("Invalid Subsprite");
                }
            }
            if (j < this.sliceHeight - 1) { //dont go down of the final pass (bad solution for now)
                //go down a layer
                curIndex = ImageProcessor.getIndexInDirection(rowInd, this.inputWidth, this.inputHeight, "DOWN", wrapping);
                if (curIndex == -1) {
                    console.error("Invalid Subsprite");
                }
            }
        }
        return subSprite;
    };
    //looks in four directions and returns valid indicies
    ImageProcessor.getIndiciesAround = function (index, width, height, wrapping) {
        var output = {};
        ["RIGHT", "LEFT", "DOWN", "UP"].forEach(function (d) {
            var ind = ImageProcessor.getIndexInDirection(index, width, height, d, wrapping);
            if (ind != -1) {
                output[d] = ind;
            }
            ;
        });
        return output;
    };
    ImageProcessor.getIndexInDirection = function (index, width, height, direction, wrapping) {
        var outOfBoundsReturnValue = -1; //what to return if tile we are trying to access goes of the sprite
        if (direction === "RIGHT") {
            if (wrapping) {
                outOfBoundsReturnValue = index + 1 - width;
            }
            return (index % width) + 1 < width ? index + 1 : outOfBoundsReturnValue;
        }
        else if (direction === "LEFT") {
            if (wrapping) {
                outOfBoundsReturnValue = index - 1 + width;
            }
            return (index % width) - 1 >= 0 ? index - 1 : outOfBoundsReturnValue;
        }
        else if (direction === "DOWN") {
            if (wrapping) {
                outOfBoundsReturnValue = index + width - width * height;
            }
            return (index + width < width * height) ? index + width : outOfBoundsReturnValue;
        }
        else if (direction === "UP") {
            if (wrapping) {
                outOfBoundsReturnValue = index - width + width * height;
            }
            return (index - width >= 0) ? index - width : outOfBoundsReturnValue;
        }
        return -1;
    };
    ImageProcessor.fillArray = function (array, value) {
        for (var i = 0; i < array.length; i++) {
            array[i] = value;
        }
    };
    return ImageProcessor;
}());
exports["default"] = ImageProcessor;
