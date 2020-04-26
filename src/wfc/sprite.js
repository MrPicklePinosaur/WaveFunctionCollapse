"use strict";
exports.__esModule = true;
var Sprite = /** @class */ (function () {
    function Sprite(width, height, pixels, wrapSprite) {
        this.width = width;
        this.height = height;
        this.pixels = pixels || Sprite.emptyPixels(width, height);
        this.wrapSprite = wrapSprite || false;
    }
    Sprite.emptyPixels = function (width, height) {
        var arr = new Array(width * height);
        for (var i = 0; i < width * height; i++) {
            arr[i] = '#000000';
        }
        return arr;
    };
    Sprite.prototype.getPixel = function (x, y) {
        var self = this;
        var ind = x + y * self.width;
        if (ind < 0 || ind > self.width * self.height) {
            console.warn("Invalid position on sprite: (" + x + "," + y + ")");
            return '#000000';
        }
        return self.pixels[ind];
    };
    Sprite.prototype.setPixel = function (x, y, color) {
        var self = this;
        var ind = x + y * self.width;
        if (ind < 0 || ind > self.width * self.height) {
            console.warn("Invalid position on sprite: (" + x + "," + y + ")");
            return;
        }
        self.pixels[ind] = color;
    };
    //width and height must be positive
    Sprite.prototype.slice = function (x, y, width, height) {
        var self = this;
        var sliced = new Array();
        var y_ind = y;
        for (var j = 0; j < height; j++) {
            var x_ind = x;
            for (var i = 0; i < width; i++) {
                var ind = x_ind + y_ind * self.width;
                sliced.push(self.pixels[ind]);
                x_ind += 1;
                if (x_ind > self.width - 1) {
                    x_ind -= self.width;
                } //wrap back around to left
            }
            y_ind += 1;
            if (y_ind > self.height - 1) {
                y_ind -= self.height;
            } //wrap back around to top
        }
        return new Sprite(width, height, sliced);
    };
    Sprite.compare = function (a, b) {
        //if the sprites arent even the same size
        if (a.pixels.length != b.pixels.length) {
            return false;
        }
        for (var i = 0; i < a.pixels.length; i++) {
            if (a.pixels[i] != b.pixels[i]) {
                return false;
            }
        }
        return true;
    };
    return Sprite;
}());
exports["default"] = Sprite;
