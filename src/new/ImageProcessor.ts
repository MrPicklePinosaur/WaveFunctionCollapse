
/*JOB is to take in an input sprite and return:
    - an indexed (simplified) input image, along with a tiletable for easy lookup
    - adjacency rules
    - frequency hints
*/

type Direction = "RIGHT" | "LEFT" | "DOWN" | "UP";

export default class ImageProcessor {

    inputSprite: string[]; //raw pixels
    inputWidth: number;
    inputHeight: number;
    sliceWidth: number;
    sliceHeight: number;

    //include options like wrapping


    //outputs
    indexedSprite: number[]; 
    index_table: Array<string[]>; //index in array corresponds to tile index

    constructor(pixels: string[], width: number, height: number, sliceWidth: number, sliceHeight: number) {
        this.inputSprite = pixels;
        this.inputWidth = width;
        this.inputHeight = height;
        this.sliceWidth = width;
        this.sliceHeight = height;

        this.indexInputImage();
    }

    indexInputImage(): void {

        for (var i = 0; i < this.inputSprite.length; i++) {

            //get a subsprite

            //check to see if it is already in the index table

                //if no, add new entry to index_table

            //update indexedSprite

        }
    }

    calculateAdjacencyRules() {

        /*format: array where the array index is the tile index
            stores a dict of DIRECTION: array
                array contains all tiles this tile enables in that direction
        */

        var adjacency = new Array<Record<Direction,Array<number>>>(this.index_table.length);
        adjacency.fill({
            "RIGHT": new Array<number>(),
            "LEFT": new Array<number>(),
            "DOWN": new Array<number>(),
            "UP": new Array<number>()
        });

        for (var i = 0; i < this.indexedSprite.length; i++) {
            var curTile = this.indexedSprite[i];

            //look in every direction and compute enablers

                //insert function that returns index in all valid directions

            //each tile is going to store it's enablers, instead of the tiles it enables

        }

    }

    calculateFrequencyHints(): Array<number> {
        //format: index of array is tile index, array stores occurences of each tile
        var frequency = new Array<number>(this.index_table.length).fill(0); //todo fix the fill function

        this.indexedSprite.forEach(t => {

            //count number of times each tile comes up
            frequency[t] += 1;

        });

        return frequency;

    }

    //looks in four directions and returns valid indicies
    static getIndiciesAround(index: number, width: number, height: number, wrapping: boolean): Record<Direction,number> { 

        var output: Record<Direction,number>;

        var right = index+1;
        var left = index-1;
        var down = index+width;
        var up = index-width;

        if (wrapping) {

            output["RIGHT"] = (right < width) ? right : right-width;
            output["LEFT"] = (left >= 0) ? left : left+width;
            output["DOWN"] = (down < width*height) ? down : down-width*height;
            output["UP"] = (up >= 0) ? up : up+width*height;

        } else {

            if (right < width) { output["RIGHT"] = right; }
            if (left >= 0) { output["LEFT"] = left; }
            if (down < width*height) { output["DOWN"] = down; }
            if (up >= 0) { output["UP"] = up; }

        }

        return output;
    }



}