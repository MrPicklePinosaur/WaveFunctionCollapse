import Sprite from './sprite.js';

class WFC {

    sprite: Sprite;

    constructor(sprite: Sprite) {
        this.sprite = sprite;
    }
    

    imageProcessor(sliceWidth: number, sliceHeight: number): Sprite[] { //takes in an image and outputs all enumerations of tiles

        var tiles = new Array<Sprite>();

        for (var j = 0; j < this.sprite.height; j++) {
            for (var i = 0; i < this.sprite.width; i++) {
                
            }
        }
        return tiles;
    }
}