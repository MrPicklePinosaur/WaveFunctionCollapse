class Pic {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.pixels = [width * height];
        for (var i = 0; i < this.pixels; i++)
            ;
    }
    
    getAt(x, y) {
        return this.pixels[y][x];
    }
    writeAt(x, y, color) {
        this.pixels[y][x] = color;
    }
}
