import Sprite from './sprite.js';


export default class WFC {

    sprite: Sprite;
    sliceWidth: number;
    sliceHeight: number;
    outputWidth: number;
    outputHeight: number;

    indexed_sprite: Array<number>;
    tile_table: Array<string[]>; //of the form tile_index: pixel_data, also, we're using the index in the array as the id/index
    frequency: Array<number>; //keeps track of the amount of times each tile appears in the input image and generates a weight
    adjacency: Array<Array<Record<number,number>>>; //of the form tile_index: [ direction: {adjacent_tileIndex: frequency_hits}]
    outputTiles: Array<Array<number>>; //holds all possible tiles for every pixel on output sprite
    //entropy_cache: Array<number>; //an array that stores the entropy of every cell

    constructor(sprite: Sprite, sliceWidth: number, sliceHeight: number, outputWidth: number, outputHeight: number) {
        this.sprite = sprite;

        this.sliceWidth = sliceWidth;
        this.sliceHeight = sliceHeight;
        this.outputWidth = outputWidth;
        this.outputHeight = outputHeight;

        this.tile_table = [];
        this.adjacency = [];

        this.outputTiles = new Array<Array<number>>(this.outputWidth*this.outputHeight);


        //this.entropy_cache = new Array<number>(this.outputWidth*this.outputHeight);
    }
    

    //gets all enumerations of the main sprite and indexes each subsprite as well as generating adjacncy rules for each subsprite
    imageProcessor(): void { 

        this.indexed_sprite = new Array<number>(this.sprite.width*this.sprite.height);

        for (var j = 0; j < this.sprite.height; j++) {
            for (var i = 0; i < this.sprite.width; i++) {

                var curPixelIndex = this.getPixelIndexAtPosition(i,j);

                //GENERATE frequency hits =-=-=-=-=-=-=-=-=
                const dirs = [[1,0],[0,1],[-1,0],[0,-1]];
                for (var d = 0; d < dirs.length; d++) {//for each valid direction

                    var dir = dirs[d];

                    var newPos = [ i+dir[0], j+dir[1] ];

                    //wrap back around
                    if (newPos[0] < 0) { newPos[0] += this.sprite.width; }
                    else if (newPos[0] > this.sprite.width-1) { newPos[0] -= this.sprite.width; }
                    if (newPos[1] < 0) { newPos[1] += this.sprite.height; }
                    else if (newPos[1] > this.sprite.height-1) { newPos[1] -= this.sprite.height; }


                    var newPixelIndex = this.getPixelIndexAtPosition(newPos[0],newPos[1]);

                    //add frequency hint to curPixel's dict of frequncy hints

                    //check if the newPixel has already been hit before
                    if (this.adjacency[curPixelIndex][d][newPixelIndex] == null) {
                        //if not, set the hit count to 1
                        this.adjacency[curPixelIndex][d][newPixelIndex] = 1;
                    } else {
                        //otherwise increment
                        this.adjacency[curPixelIndex][d][newPixelIndex] += 1;
                    }

                }

            }
        }
    }


    //HELPER METHODS
    getPixelIndex(pixels: string[]): number { //finds index/id of a pixel pattern
        var index = -1;
        for (var c = 0; c < this.tile_table.length; c++) {
            if (Sprite.compare(pixels,this.tile_table[c])) {
                index = c; //grab the index of the tile
                break;
            }
        }
        //if the pixel pattern was not found, add it
        if (index == -1) {
            this.tile_table.push(pixels);
            this.adjacency.push([{},{},{},{}]); //don't forget to also add a new entry in adjacency hints
            index = this.tile_table.length-1; //set the current index as the last position
        }

        return index; //return index of -1 if not found
    }

    getPixelIndexAtPosition(x: number, y: number): number { //get pixel at position on main sprite
        if (this.indexed_sprite == null) {
            console.warn("indexed_sprite array not initialized yet!!");
        }

        //check if the tile at position (x,y) has been indexed yet
        var pos = x+y*this.sprite.width;
        if (this.indexed_sprite[pos] == null) {
            //if it hasnt been indexed, index it and then return
            var subSprite: string[] = this.sprite.slice(x,y,this.sliceWidth,this.sliceHeight);
            var pixelIndex = this.getPixelIndex(subSprite);
            this.indexed_sprite[pos] = pixelIndex;
            return pixelIndex;
        } 
        //if it has already been indexed, just return the index/id of the tile
        return this.indexed_sprite[pos];
    }

    computeFrequencyHints() { //calculates the frequency each tile appears in the input sprite
        //this.frequency = new Array<number>(this.tile_table.length).fill(0);
        //this.frequency = Array.from({length: this.tile_table.length}, (v,k) => 0);

        this.frequency = new Array<number>(this.tile_table.length);
        //fill the array with 0, find an actual way to do this later
        for (var i = 0; i < this.frequency.length; i++) { this.frequency[i] = 0; }

        this.indexed_sprite.forEach(element => {
            this.frequency[element] += 1;
        });
    }

    collapse() {
        //assume every single tile can appear anywhere at first
        for (var i = 0; i < this.outputTiles.length; i++) {
            var possibleTiles = new Array<number>(this.tile_table.length);
            for (var p = 0; p < possibleTiles.length; p++) { possibleTiles[p] = p; }
            this.outputTiles[i] = possibleTiles;
        }

    }

    calculateEntropyAt(x: number, y: number): number {
        var possibleTiles: Array<number> = this.outputTiles[x+y*this.sprite.width];

        var entropy = 0;
        var W = this.indexed_sprite.length; //W is total weight

        possibleTiles.forEach(w => {
            entropy += w*Math.log2(w);
        });

        entropy = -1/W + Math.log2(W);
        
        return entropy;
    }
    /*
    calculateEntropyAt(x: number, y: number) {

        //merge all surrounding cells adjacency data

        var mergedAdjacenecy: Record<number,number> = {};
        const dirs = [[1,0],[0,1],[-1,0],[0,-1]];
        for (var d = 0; d < dirs.length; d++) {//for each valid direction

            var dir = dirs[d];
            var newPos = [ x+dir[0], y+dir[1] ];

            //only choose valid surrounding tiles
            if (!this.sprite.wrapSprite && (newPos[0] < 0 || newPos[0] > this.outputWidth-1 || newPos[1] < 0 || newPos[1] > this.outputHeight-1)) {
                continue;
            }

            //otherwise wrap is on, and we want to wrap back around
            if (newPos[0] < 0) { newPos[0] += this.outputWidth; }
            else if (newPos[0] > this.outputWidth-1) { newPos[0] -= this.outputWidth; }
            if (newPos[1] < 0) { newPos[1] += this.outputHeight; }
            else if (newPos[1] > this.outputHeight-1) { newPos[1] -= this.outputHeight; }

            var newD = d+2; //flip the direction
            if (newD > 3) { newD -= 4; }
            if (newD < 0) { newD += 4}
            var adj_data = this.adjacency[newPos[0]+newPos[1]*this.sprite.width][newD];  

            Object.keys(adj_data).forEach(function(key) {

                if (mergedAdjacenecy.hasOwnProperty(key)) { //if the merged data already exists
                    mergedAdjacenecy[key] += adj_data[key];
                } else {
                    mergedAdjacenecy[key] = adj_data[key];
                }
            });

        }


        return mergedAdjacenecy;
    }
    */


}