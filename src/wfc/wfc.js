"use strict";
exports.__esModule = true;
var WFC = /** @class */ (function () {
    function WFC(sprite) {
        this.sprite = sprite;
    }
    WFC.prototype.imageProcessor = function (sliceWidth, sliceHeight) {
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
    };
    return WFC;
}());
exports["default"] = WFC;
