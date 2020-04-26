import Sprite from './sprite.js';

export default class WFC {

    sprite: Sprite;

    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }
    

    imageProcessor(sliceWidth: number, sliceHeight: number): Sprite[] { //takes in an image and outputs all enumerations of tiles

        var offsetX = 0;
        var offsetY = 0;
        if(!this.sprite.wrapSprite) {
            offsetX = this.sprite.width;
            offsetY = this.sprite.height;
        }

        var tiles = new Array<Sprite>();

        for (var j = 0; j < this.sprite.height-offsetY; j++) {
            for (var i = 0; i < this.sprite.width-offsetX; i++) {
                tiles.push(this.sprite.slice(i,j,sliceWidth,sliceWidth));
            }
        }
        return tiles;
    }
}