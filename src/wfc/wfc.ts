import Sprite from './sprite.js';

export default class WFC {

    sprite: Sprite;
    sliceWidth: number;
    sliceHeight: number;

    indexed_sprite: Array<number>;
    tile_table: Array<string[]>; //of the form tile_index: pixel_data
    adjacency: Array<Record<number,number>>; //of the form tile_index: [adjacent_tileIndex: frequency_hits]

    constructor(sprite: Sprite, sliceWidth: number, sliceHeight: number) {
        this.sprite = sprite;

        this.sliceWidth = sliceWidth;
        this.sliceHeight = sliceWidth;

        this.tile_table = [];
        this.adjacency = [];
    }
    

    //gets all enumerations of the main sprite and indexes each subsprite as well as generating adjacncy rules for each subsprite
    imageProcessor(): void { 

        //handle wrapping sprites
        var outputWidth = this.sprite.width;
        var outputHeight = this.sprite.height;
        if(!this.sprite.wrapSprite) { //if wrapping is off
            outputWidth -= this.sliceWidth;
            outputHeight -= this.sliceHeight;
        }

        this.indexed_sprite = new Array<number>(outputWidth*outputHeight);


        for (var j = 0; j < outputHeight; j++) {
            for (var i = 0; i < outputWidth; i++) {

                var curPixelIndex = this.getPixelIndexAtPosition(i,j);

                //GENERATE frequency hits =-=-=-=-=-=-=-=-=

                for (var dir of [[1,0],[0,1],[-1,0],[0,-1]]) { //for each direction

                    var newPos = [ i+dir[0], j+dir[1] ];

                    //if direction is invalid
                    if (newPos[0] < 0 || newPos[0] > outputWidth-1 || newPos[1] < 0 || newPos[1] > outputHeight-1) {
                        continue;
                    }

                    var newPixelIndex = this.getPixelIndexAtPosition(newPos[0],newPos[1]);

                    //add frequency hint to curPixel's dict of frequncy hints

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
            this.adjacency.push({});
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

}