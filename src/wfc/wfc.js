export default class WFC {
    constructor(sprite) {
        this.sprite = sprite;
    }
    imageProcessor(sliceWidth, sliceHeight) {
        var offsetX = 0;
        var offsetY = 0;
        if (!this.sprite.wrapSprite) {
            offsetX = this.sprite.width;
            offsetY = this.sprite.height;
        }
        var tiles = new Array();
        for (var j = 0; j < this.sprite.height - offsetY; j++) {
            for (var i = 0; i < this.sprite.width - offsetX; i++) {
                tiles.push(this.sprite.slice(i, j, sliceWidth, sliceWidth));
            }
        }
        return tiles;
    }
}
