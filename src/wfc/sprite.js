"use strict";
exports.__esModule = true;
var Sprite = /** @class */ (function () {
    function Sprite(width, height, pixels) {
        this.width = width;
        this.height = height;
        this.pixels = pixels || Sprite.emptyPixels(width, height);
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
    Sprite.prototype.slice = function (x, y, sliceWidth, sliceHeight) {
        var self = this;
        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            console.warn("INVALID SLICE PARAMETERS " + x + "," + y + "," + sliceWidth + "," + sliceHeight);
            return null;
        }
        var sliced = new Array();
        var y_ind = y;
        for (var j = 0; j < sliceHeight; j++) {
            var x_ind = x;
            for (var i = 0; i < sliceWidth; i++) {
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
        return sliced;
    };
    Sprite.compare = function (a, b) {
        //if the sprites arent even the same size
        if (a.length != b.length) {
            return false;
        }
        for (var i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    };
    return Sprite;
}());
exports["default"] = Sprite;
