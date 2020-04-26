import Sprite from './sprite.js';

export default class WFC {

    sprite: Sprite;
    tile_table: Array<string[]>; //of the form tile_index: pixel_data
    adjacency: Array<Record<number,number>>; //of the form tile_index: [adjacent_tileIndex: frequency_hits]

    constructor(sprite: Sprite) {
        this.sprite = sprite;
        this.tile_table = [];
        this.adjacency = [];
    }
    
    //gets all enumerations of the main sprite and indexes each subsprite as well as generating adjacncy rules for each subsprite
    imageProcessor(sliceWidth: number, sliceHeight: number): void { 

        //handle wrapping sprites
        var offsetX = 0;
        var offsetY = 0;
        if(!this.sprite.wrapSprite) {
            offsetX = (sliceWidth > 0) ? sliceWidth-1 : 0;
            offsetY = (sliceHeight > 0) ? sliceHeight-1 : 0;
        }


        for (var j = 0; j < this.sprite.height-offsetY; j++) {
            for (var i = 0; i < this.sprite.width-offsetX; i++) {

                var subSprite: string[] = this.sprite.slice(i,j,sliceWidth,sliceHeight);

                //INDEX the sprite =-=-=-=-=-=-=-=-=

                //check to see if sprite is in the tile_table already
                var spriteInd = -1;
                for (var c = 0; c < this.tile_table.length; c++) {
                    if (Sprite.compare(subSprite,this.tile_table[c])) {
                        spriteInd = c; //grab the index of the tile
                        break;
                    }
                }

                //if the tile was not already indexed, add it 
                if (spriteInd == -1) {
                    this.tile_table.push(subSprite);
                    this.adjacency.push({});
                    spriteInd = this.tile_table.length-1; //set the current index as the last position
                }

                //GENERATE frequency hits =-=-=-=-=-=-=-=-=

                for (var dir of [[1,0],[0,1],[-1,0],[0,-1]]) { //for each direction

                    var newPos = [ i+dir[0], j+dir[1] ];

                    //if direction is invalid
                    if (newPos[0] < 0 || newPos[0] > this.sprite.width-1 || newPos[1] < 0 || newPos[1] > this.sprite.height-1) {
                        continue;
                    }

                    


                }
 

            }
        }

    }
}