
/*JOB is to take in an input sprite and return:
    - an indexed (simplified) input image, along with a tiletable for easy lookup
    - adjacency rules
    - frequency hints

*/

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

    constructor(pixels: string[], width: number, height: number, sliceWidth: number, sliceHeight: number, options: Object) {
        this.inputSprite = pixels;
        this.inputWidth = width;
        this.inputHeight = height;
        this.sliceWidth = width;
        this.sliceHeight = height;

        this.indexInputImage();
    }

    indexInputImage(): void {

        for (var i = 0; i < this.inputSprite.length; i++) {

            //get a subsprite (complying to wrapping rules)

            //check to see if it is already in the index table

                //if no, add new entry to index_table

            //update indexedSprite

        }
    }

    calculateAdjacencyRules() {

        for (var i = 0; i < this.indexedSprite.length; i++) {

            //look in every direction and compute enablers 
            //each tile is going to store it's enablers, instead of the tiles it enables
        }

    }

    calculateFrequencyHints() {

        for (var i = 0; i < this.indexedSprite.length; i++) {

            //count number of times each tile comes up

        }

    }



}