export default class Sprite {
    constructor(width, height, pixels, wrapSprite) {
        this.width = width;
        this.height = height;
        this.pixels = pixels || new Array(width * height).fill('#000000');
        this.wrapSprite = wrapSprite || false;
    }
    getPixel(x, y) {
        var ind = x + y * this.width;
        if (ind < 0 || ind > this.width * this.height) {
            console.warn(`Invalid position on sprite: (${x},${y})`);
            return '#000000';
        }
        return this.pixels[ind];
    }
    setPixel(x, y, color) {
        var ind = x + y * this.width;
        if (ind < 0 || ind > this.width * this.height) {
            console.warn(`Invalid position on sprite: (${x},${y})`);
            return;
        }
        this.pixels[ind] = color;
    }
    //width and height must be positive
    slice(x, y, width, height) {
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
    }
}
