import Sprite from './sprite.js';


export default class WFC {

    sprite: Sprite;
    sliceWidth: number;
    sliceHeight: number;

    outputWidth: number;
    outputHeight: number;

    indexed_sprite: Array<number>;
    tile_table: Array<string[]>; //of the form tile_index: pixel_data, also, we're using the index in the array as the id/index
    adjacency: Array<Array<Record<number,number>>>; //of the form tile_index: [ direction: {adjacent_tileIndex: frequency_hits}]
    //adjacency: Array<Record<number,AdjacencyData>>;
    entropy_cache: Array<number>; //an array that stores the entropy of every cell

    constructor(sprite: Sprite, sliceWidth: number, sliceHeight: number) {
        this.sprite = sprite;

        this.sliceWidth = sliceWidth;
        this.sliceHeight = sliceWidth;

        //handle wrapping sprites
        //default to wrapping on
        this.outputWidth = this.sprite.width;
        this.outputHeight = this.sprite.height;
        if(!this.sprite.wrapSprite) { //if wrapping is off
            this.outputWidth -= (this.sliceWidth-1);
            this.outputHeight -= (this.sliceHeight-1);
        }

        this.indexed_sprite = new Array<number>(this.outputWidth*this.outputHeight);
        this.tile_table = [];
        //this.adjacency = [[ [1,0], {} ],[ [0,1], {} ],[ [-1,0], {} ],[ [0,-1], {} ]];
        this.adjacency = [];
        this.entropy_cache = new Array<number>(this.outputWidth*this.outputHeight);
    }
    

    //gets all enumerations of the main sprite and indexes each subsprite as well as generating adjacncy rules for each subsprite
    imageProcessor(): void { 

        for (var j = 0; j < this.outputHeight; j++) {
            for (var i = 0; i < this.outputWidth; i++) {

                var curPixelIndex = this.getPixelIndexAtPosition(i,j);

                //GENERATE frequency hits =-=-=-=-=-=-=-=-=
                const dirs = [[1,0],[0,1],[-1,0],[0,-1]];
                for (var d = 0; d < dirs.length; d++) {//for each valid direction

                    var dir = dirs[d];

                    var newPos = [ i+dir[0], j+dir[1] ];

                    //if wrap is off and direction is invalid
                    if (!this.sprite.wrapSprite && (newPos[0] < 0 || newPos[0] > this.outputWidth-1 || newPos[1] < 0 || newPos[1] > this.outputHeight-1)) {
                        continue;
                    }

                    //otherwise wrap is on, and we want to wrap back around
                    if (newPos[0] < 0) { newPos[0] += this.outputWidth; }
                    else if (newPos[0] > this.outputWidth-1) { newPos[0] -= this.outputWidth; }
                    if (newPos[1] < 0) { newPos[1] += this.outputHeight; }
                    else if (newPos[1] > this.outputHeight-1) { newPos[1] -= this.outputHeight; }


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


}