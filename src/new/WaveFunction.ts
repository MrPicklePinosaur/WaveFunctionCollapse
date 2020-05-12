
import Direction, {logb2, filledArray} from "./Utils.js";

export default class WaveFunction {

    outputWidth: number;
    outputHeight: number;

    //other inputs
    index_table: Array<string[]>;
    frequency: number[];
    adjacency;

    wavefunction: Array<number[]>;
    entropy_stack: Array<{entropy: number, index: number}> = []; //sorted array from lowest to highest entropy format

    constructor(outputWidth: number, outputHeight: number, index_table: Array<string[]>, frequency: number[], adjacency) {
        this.outputWidth = outputWidth;
        this.outputHeight = outputHeight;

        this.index_table = index_table;
        this.frequency = frequency;
        this.adjacency = adjacency;

        //prepopulate wavefunction
        this.wavefunction = new Array<number[]>();

        var empty = [];
        for (var i = 0; i < this.index_table.length; i++) { empty[i] = i; }

        for (var i = 0; i < this.outputWidth*this.outputHeight; i++) {
            //every tile has the ability to be anywhere from the start
            this.wavefunction.push([...empty]);
        }

        //prepopulate entropy stack
        for (var i = 0; i < this.wavefunction.length; i++) {
            //calculate entropy and insert it sorted into entropy stack
            var H = this.calculateEntropy(this.wavefunction[i]);

            //sorted insert
            this.sortedInsertIntoEntropyStack(H,i);
        }

    }

    waveFunctionCollapse() {

        //TODO: add some sort of check to not collapsed already collapsed tiles

        var lowestEntropyInd = this.entropy_stack.shift().index;

        //collapse tile

        //check to see if tile has already been collapsed
        if (this.wavefunction[lowestEntropyInd].length <= 1) { return; } 

        this.collapseTile(lowestEntropyInd);

        //propogate effect
        var callback_queue: number[] = []; //holds positions of all functions to check enablers

        //prepopulate queue


        //while callback queue is not empty
        while (callback_queue.length > 0) {

            //check enablers

            //if something was invalid and removed, propogate again
            
        }


    }

    collapseTile(position: number) { //chooses one possiblitiy based on frequency hints
        var possibilityStrip = [];

        this.wavefunction[position].forEach(t => {
            var freq = this.frequency[t];
            var newStripSegment = filledArray(t,freq);
            possibilityStrip = [...possibilityStrip,...newStripSegment];
        });  

        //choose random item on possibility strip
        var choice = possibilityStrip[Math.floor(Math.random()*possibilityStrip.length)];

        this.wavefunction[position] = [choice];
    }

    checkEnablers(position: number): boolean { //return true if nothing was invalid
        //check enablers in four directions and remove any possibilities that are invalid
        
        return true;
    }

    //helpers
    calculateEntropy(possibilities: number[]): number {

        var entropy = 0;
        var W = this.frequency.reduce((a,b) => a+b, 0); //sum of all values

        possibilities.forEach(p => {
            var w = this.frequency[p];
            entropy += w*logb2(w);
        });

        entropy = -1/W * entropy + logb2(W);

        //add a tiny amount of noise to break any ties
        entropy += Math.random()/1000000;
        return entropy;
    }

    sortedInsertIntoEntropyStack(entropy: number, tile_index: number) {
        for (var i = 0; i < this.entropy_stack.length; i++) {
            var h = this.entropy_stack[i].entropy;

            if (entropy <= h) {
                this.entropy_stack.splice(i,0,{entropy: entropy, index: tile_index});
                //console.log(`inserted ${entropy} at ${i}`);
                return;
            }
        }

        this.entropy_stack.push({entropy: entropy, index: tile_index});
        //console.log(`inserted ${entropy} last`);
    }

}