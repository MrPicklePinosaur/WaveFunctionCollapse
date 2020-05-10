
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
            var subSprite = this.getSubSprite(i,true);

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
        ImageProcessor.fillArray(adjacency,{
            "RIGHT": new Array<number>(),
            "LEFT": new Array<number>(),
            "DOWN": new Array<number>(),
            "UP": new Array<number>()
        });

        for (var i = 0; i < this.indexedSprite.length; i++) {
            var curTile = this.indexedSprite[i];

            //look in every direction and compute enablers
            var newInds = ImageProcessor.getIndiciesAround(i,this.inputWidth,this.inputHeight,true); //REPLACE THIS LATER
            
            Object.keys(newInds).forEach(dir => {
                var newInd = newInds[dir];

                //each tile is going to store it's enablers, instead of the tiles it enables
                var newTileIndex = this.indexedSprite[newInd];
                if (!adjacency[i][dir].contains(newTileIndex)) {
                    adjacency[i][dir].push(newTileIndex);
                }
            }); 

        }

        return adjacency;

    }

    calculateFrequencyHints(): Array<number> {
        //format: index of array is tile index, array stores occurences of each tile
        var frequency = new Array<number>(this.index_table.length);
        ImageProcessor.fillArray(frequency,0);

        this.indexedSprite.forEach(t => {

            //count number of times each tile comes up
            frequency[t] += 1;

        });

        return frequency;

    }

    //helpers
    getSubSprite(index: number, wrapping: boolean): Array<string> {
        var subSprite = new Array<string>();

        var curIndex = index;
        for (var j = 0; j < this.sliceHeight; j++) {

            subSprite.push(this.inputSprite[curIndex]);

            for (var i = 0; i < this.sliceWidth; i++) {

                //shift to the right
                curIndex = ImageProcessor.getIndexInDirection(index,this.sliceWidth,this.sliceHeight,"RIGHT",wrapping);
                if (curIndex == -1) { console.error("Invalid Subsprite"); }

                subSprite.push(this.inputSprite[curIndex]);

            }

            //go down a layer
            curIndex = ImageProcessor.getIndexInDirection(index,this.sliceWidth,this.sliceHeight,"RIGHT",wrapping);
            if (curIndex == -1) { console.error("Invalid Subsprite"); }

        }

        return subSprite;
    }


    //looks in four directions and returns valid indicies
    static getIndiciesAround(index: number, width: number, height: number, wrapping: boolean): Record<Direction,number> { 

        var output: Record<Direction,number>;

        ["RIGHT","LEFT","DOWN","UP"].forEach(d => {
            var ind = ImageProcessor.getIndexInDirection(index,width,height,<Direction> d,wrapping);
            if (ind != -1) { output[d] = ind; };
        });

        return output;
    }

    static getIndexInDirection(index: number, width: number, height: number, direction: Direction, wrapping: boolean): number {

        var outOfBoundsReturnValue = -1; //what to return if tile we are trying to access goes of the sprite

        if (direction === "RIGHT") {

            if (wrapping) { outOfBoundsReturnValue = index+1-width; } 
            return (index%width)+1 < width ? index+1 : outOfBoundsReturnValue;

        } else if (direction === "LEFT") {

            if (wrapping) { outOfBoundsReturnValue = index-1+width; }
            return (index%width)-1 >= 0 ? index-1 : outOfBoundsReturnValue;

        } else if (direction === "DOWN") {

            if (wrapping) { outOfBoundsReturnValue = index+width-width*height; }
            return (index+width < width*height) ? index+width : outOfBoundsReturnValue;

        } else if (direction === "UP") {

            if (wrapping) { outOfBoundsReturnValue = index-width+width*height}
            return (index-width >= 0) ? index-width : outOfBoundsReturnValue;
            
        }

        return -1;

    }

    static fillArray<T>(array: Array<T>, value: T) {

        for (var i = 0; i < array.length; i++) {
            array[i] = value;
        }

    }

}