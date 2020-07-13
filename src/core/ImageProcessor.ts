
/*JOB is to take in an input sprite and return:
    - an indexed (simplified) input image, along with a tiletable for easy lookup
    - adjacency rules
    - frequency hints
*/
import Direction, { getIndiciesAround, compareArray, findNestedArray } from "./lib/utils";

type AdjacencyData = {
   right: number[],
   left: number[],
   down: number[],
   up: number[]
}

export default class ImageProcessor {

    inputSprite: string[]; //raw pixels
    inputWidth: number;
    inputHeight: number;
    sliceWidth: number;
    sliceHeight: number;

    //include options like wrapping

    //outputs
    indexedSprite: number[] = new Array<number>(); 
    index_table: Array<string[]> = new Array<string[]>(); //index in array corresponds to tile index

    constructor(pixels: string[], width: number, height: number, sliceWidth: number, sliceHeight: number) {
        this.inputSprite = pixels;
        this.inputWidth = width;
        this.inputHeight = height;
        this.sliceWidth = sliceWidth;
        this.sliceHeight = sliceHeight;

        this.indexInputImage();
    }

    indexInputImage(): void {

        for (var i = 0; i < this.inputSprite.length; i++) {

            //get a subsprite
            var subSprite = this.getSubSprite(i,true);

            //check to see if it is already in the index table
            var ind = findNestedArray(this.index_table,subSprite);

            if (ind == -1) { //if no, add new entry to index_table
                this.index_table.push(subSprite);
                ind = this.index_table.length-1;
            }

            this.indexedSprite[i] = ind; //update indexedSprite

        }

    }

    calculateAdjacencyRules() {

        /*format: array where the array index is the tile index
            stores a dict of DIRECTION: array
                array contains all tiles this tile enables in that direction
        */

        //var adjacency = new Array<Record<Direction,Array<number>>>(this.index_table.length);
        var adjacency = new Array<AdjacencyData>(this.index_table.length).fill({right:[],left:[],down:[],up:[]});
        
        for (var i = 0; i < this.indexedSprite.length; i++) {
            var curTile = this.indexedSprite[i];

            //look in every direction and compute enablers
            var newInds = getIndiciesAround(i,this.inputWidth,this.inputHeight,true); 
            
            if (newInds.right != undefined) { adjacency[i].right.push(newInds.right); }
            if (newInds.left != undefined) { adjacency[i].left.push(newInds.left); }
            if (newInds.down != undefined) { adjacency[i].down.push(newInds.down); }
            if (newInds.up != undefined) { adjacency[i].up.push(newInds.up); }
        }

        return adjacency;

    }

    calculateFrequencyHints(): Array<number> {
        //format: index of array is tile index, array stores occurences of each tile

        var frequency = new Array<number>();
        for (var i = 0; i < this.index_table.length; i++) { frequency.push(0); }

        this.indexedSprite.forEach(t => {

            //count number of times each tile comes up
            frequency[t] += 1;

        });

        return frequency;

    }

    getSubSprite(index: number, wrapping: boolean): Array<string> {

        //check to see if input is valid
        if (index < 0 || index > this.inputWidth*this.inputHeight-1 ) {
            console.warn("slice start position out of bounds");
        }
        //prob not necessary
        // if (index%this.sliceWidth+this.sliceWidth > this.inputWidth || Math.floor(index/this.sliceWidth)+this.sliceHeight > this.inputHeight) {
        //     console.warn("slice dimensions are invalid")
        // }

        var subSprite = new Array<string>();

        var currentIndex = index;
        for (var j = 0; j < this.sliceHeight; j++) {
            
            for (var i = 0; i < this.sliceWidth; i++) {
                subSprite.push(this.inputSprite[currentIndex]);

                //check to see if we should wrap back around
                if (currentIndex%this.inputWidth+1 > this.inputWidth) {
                    currentIndex += (1-this.inputWidth);
                } else {
                    currentIndex += 1;
                }
                
            }

            currentIndex += (this.inputWidth-this.sliceWidth);

        }

        return subSprite;
    }


    //NOTE: FIX THISSS!!!!!
    //helpers
    // getSubSprite(index: number, wrapping: boolean): Array<string> {
    //     var subSprite = new Array<string>();

    //     var curIndex = index;
    //     for (var j = 0; j < this.sliceHeight; j++) {

    //         var rowInd = curIndex; //save the position of the beginning of the row

    //         for (var i = 0; i < this.sliceWidth; i++) {

    //             subSprite.push(this.inputSprite[curIndex]);

    //             //shift to the right
    //             curIndex = getIndexInDirection(curIndex,this.inputWidth,this.inputHeight,"RIGHT",wrapping);
    //             if (curIndex == -1) { console.error("Invalid Subsprite"); }

    //         }

    //         if (j < this.sliceHeight-1) { //dont go down of the final pass (bad solution for now)
    //             //go down a layer
    //             curIndex = getIndexInDirection(rowInd,this.inputWidth,this.inputHeight,"DOWN",wrapping);
    //             if (curIndex == -1) { console.error("Invalid Subsprite"); }
    //         }
    //     }

    //     return subSprite;
    // }
}