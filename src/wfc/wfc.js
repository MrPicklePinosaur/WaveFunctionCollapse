"use strict";
exports.__esModule = true;
var WFC = /** @class */ (function () {
    function WFC(sprite) {
        this.sprite = sprite;
        this.tile_table = [];
        this.adjacency = [];
    }
    //gets all enumerations of the main sprite and indexes each subsprite as well as generating adjacncy rules for each subsprite
    WFC.prototype.imageProcessor = function (sliceWidth, sliceHeight) {
        //handle wrapping sprites
        var offsetX = 0;
        var offsetY = 0;
        if (!this.sprite.wrapSprite) {
            offsetX = (sliceWidth > 0) ? sliceWidth - 1 : 0;
            offsetY = (sliceHeight > 0) ? sliceHeight - 1 : 0;
        }
        var tiles = new Array();
        for (var j = 0; j < this.sprite.height - offsetY; j++) {
            for (var i = 0; i < this.sprite.width - offsetX; i++) {
                tiles.push(this.sprite.slice(i, j, sliceWidth, sliceHeight));
            }
        }
        return tiles;
    };
    return WFC;
}());
exports["default"] = WFC;
