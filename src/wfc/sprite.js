"use strict";
exports.__esModule = true;
var Sprite = /** @class */ (function () {
    function Sprite(width, height, pixels, wrapSprite) {
        this.width = width;
        this.height = height;
        this.pixels = pixels || this.emptyPixels(width, height);
        this.wrapSprite = wrapSprite || false;
    }
    Sprite.prototype.emptyPixels = function (width, height) {
        var arr = new Array(width * height);
        for (var i = 0; i < width * height; i++) {
            arr[i] = '#000000';
        }
        return arr;
    };
    Sprite.prototype.getPixel = function (x, y) {
        var ind = x + y * this.width;
        if (ind < 0 || ind > this.width * this.height) {
            console.warn("Invalid position on sprite: (" + x + "," + y + ")");
            return '#000000';
        }
        return this.pixels[ind];
    };
    Sprite.prototype.setPixel = function (x, y, color) {
        var ind = x + y * this.width;
        if (ind < 0 || ind > this.width * this.height) {
            console.warn("Invalid position on sprite: (" + x + "," + y + ")");
            return;
        }
        this.pixels[ind] = color;
    };
    //width and height must be positive
    Sprite.prototype.slice = function (x, y, width, height) {
        var sliced = new Array();
        var y_ind = y;
        for (var j = 0; j < height; j++) {
            y_ind += 1;
            if (y_ind > this.height) {
                y -= height;
            } //wrap back around to top
            var x_ind = x;
            for (var i = 0; i < width; i++) {
                x_ind += 1;
                if (x_ind > this.width) {
                    x_ind -= width;
                } //wrap back around to left
                var ind = x_ind + y_ind * width;
                sliced.push(this.pixels[ind]);
            }
        }
        return new Sprite(width, height, sliced);
    };
    return Sprite;
}());
exports["default"] = Sprite;
