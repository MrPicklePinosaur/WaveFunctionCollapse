import Sprite from './sprite.js';

export default class WFC {

    sprite: Sprite;
    tile_table: Array<Sprite>; //of the form tile_index: Sprite
    adjacency: Array<Record<number,number>>; //of the form tile_index: [adjacent_tileIndex: frequency_hits]

    constructor(sprite: Sprite) {
        this.sprite = sprite;
        this.tile_table = [];
        this.adjacency = [];
    }
    
    //gets all enumerations of the main sprite and indexes each subsprite as well as generating adjacncy rules for each subsprite
    imageProcessor(sliceWidth: number, sliceHeight: number): Sprite[] { //takes in an image and outputs all enumerations of tiles

        //handle wrapping sprites
        var offsetX = 0;
        var offsetY = 0;
        if(!this.sprite.wrapSprite) {
            offsetX = (sliceWidth > 0) ? sliceWidth-1 : 0;
            offsetY = (sliceHeight > 0) ? sliceHeight-1 : 0;
        }

        var tiles = new Array<Sprite>();

        for (var j = 0; j < this.sprite.height-offsetY; j++) {
            for (var i = 0; i < this.sprite.width-offsetX; i++) {

                tiles.push(this.sprite.slice(i,j,sliceWidth,sliceHeight));
            }
        }
        return tiles;
    }
}