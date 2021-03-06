import Sprite from './sprite.js';
export default class WFC {
    constructor(sprite, sliceWidth, sliceHeight, outputWidth, outputHeight) {
        this.sprite = sprite;
        this.sliceWidth = sliceWidth;
        this.sliceHeight = sliceHeight;
        this.outputWidth = outputWidth;
        this.outputHeight = outputHeight;
        this.tile_table = [];
        this.adjacency = [];
        this.outputTiles = new Array(this.outputWidth * this.outputHeight);
        //this.entropy_cache = new Array<number>(this.outputWidth*this.outputHeight);
        this.entropy_cache = [];
    }
    //gets all enumerations of the main sprite and indexes each subsprite as well as generating adjacncy rules for each subsprite
    imageProcessor() {
        this.indexed_sprite = new Array(this.sprite.width * this.sprite.height);
        for (var j = 0; j < this.sprite.height; j++) {
            for (var i = 0; i < this.sprite.width; i++) {
                var curPixelIndex = this.getPixelIndexAtPosition(i, j);
                //GENERATE frequency hits =-=-=-=-=-=-=-=-=
                for (var d = 0; d < WFC.dirs.length; d++) { //for each valid direction
                    var dir = WFC.dirs[d];
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
    }
    //HELPER METHODS
    getPixelIndex(pixels) {
        var index = -1;
        for (var c = 0; c < this.tile_table.length; c++) {
            if (Sprite.compare(pixels, this.tile_table[c])) {
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
    }
    getPixelIndexAtPosition(x, y) {
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
    }
    //MAYBE, instead of using the input image tile occurences, use occurences in adjacency rules    
    computeFrequencyHints() {
        //this.frequency = new Array<number>(this.tile_table.length).fill(0);
        //this.frequency = Array.from({length: this.tile_table.length}, (v,k) => 0);
        this.frequency = new Array(this.tile_table.length);
        //fill the array with 0, find an actual way to do this later
        for (var i = 0; i < this.frequency.length; i++) {
            this.frequency[i] = 0;
        }
        this.indexed_sprite.forEach(element => {
            this.frequency[element] += 1;
        });
    }
    collapse() {
        //populate cells with all possible tiles - assume every single tile can appear anywhere at first
        for (var i = 0; i < this.outputTiles.length; i++) {
            var possibleTiles = new Array(this.tile_table.length);
            for (var p = 0; p < possibleTiles.length; p++) {
                possibleTiles[p] = p;
            }
            this.outputTiles[i] = possibleTiles;
            //compute entropies for all the cells
            var H = this.calculateEntropyAt(i);
            this.sortedEntropyInsert(H, i);
        }
        //choose cell to collapse based on lowest entropy
        var collapse_index = this.entropy_cache.shift()[1];
        //collapse the cell - remove all other possible tiles from the cell
        var tiles = this.outputTiles[collapse_index];
        this.outputTiles = [this.chooseTile(tiles)];
        //start propogation
        var propStack = []; //array of tile indicies
        //prepopulate
        var ind_offsets = [-1, 1, -this.outputWidth, this.outputHeight];
        ind_offsets.forEach(o => {
            var new_ind = collapse_index + o;
            //if within bounds
            if (!(new_ind < 0 || new_ind > this.outputWidth * this.outputHeight - 1)) {
                propStack.push(new_ind);
            }
        });
        while (propStack.length > 0) {
            var curInd = propStack.unshift();
            //check enablers in every direction
            //if a possible tile becomes invalid, remove it, recalculate entropies, and then repeat for all cells in every direction (besides one we came from)
            //once propogation stack is empty, choose new cell to collapse
        }
        //NOTES: instead of operating by x,y coordinates, consider using indicies instead, write a function that finds valid indicies in all four directions
    }
    calculateEntropyAt(i) {
        var possibleTiles = this.outputTiles[i];
        var entropy = 0;
        var W = this.indexed_sprite.length; //W is total weight
        possibleTiles.forEach(w => {
            entropy += w * WFC.logb2(w);
        });
        entropy = -1 / W + WFC.logb2(W);
        //add a tiny amount of noise to break any ties
        entropy += Math.random() / 1000000;
        return entropy;
    }
    //a tile is only valid if every single tile around it allows it to be there
    checkEnablers(x, y) {
        var curTiles = this.outputTiles[x + y * this.outputWidth];
        for (var d = 0; d < WFC.dirs.length; d++) {
            var dir = WFC.dirs[d];
            var newPos = [x + dir[0], y + dir[1]];
            var oppD = d + 2 > 3 ? d - 2 : d + 2;
            if (newPos[0] < 0 || newPos[0] > this.outputWidth - 1 || newPos[1] < 0 || newPos[1] > this.outputHeight - 1) {
                continue;
            }
            var ind = newPos[0] + newPos[1] * this.outputWidth;
            var adjRules = this.adjacency[ind][oppD];
            //check to see if adjaceny rules allow for tiles in current position
            curTiles.forEach(t => {
            });
        }
    }
    chooseTile(tiles) {
        var possibilityStrip = [];
        //generate strip of tiles (for weighted choice)
        tiles.forEach(t => {
            var freq = this.frequency[t];
            var newStripSegment = new Array(freq);
            WFC.fillArray(newStripSegment, t);
            possibilityStrip = [...possibilityStrip, ...newStripSegment];
        });
        //choose random tile on strip
        var ind = Math.floor(Math.random() * possibilityStrip.length);
        return possibilityStrip[ind];
    }
    sortedEntropyInsert(entropy, tile_index) {
        for (var i = 0; i < this.entropy_cache.length; i++) {
            var curEntropy = this.entropy_cache[i][0];
            if (entropy > curEntropy) {
                //insert after 
                this.entropy_cache.splice(i, 0, [entropy, tile_index]);
                return;
            }
        }
        this.entropy_cache.push([entropy, tile_index]);
    }
    //helpers
    static logb2(x) {
        return Math.log(x) / Math.log(2);
    }
    static fillArray(array, value) {
        for (var i = 0; i < array.length; i++) {
            array[i] = value;
        }
    }
}
WFC.dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
