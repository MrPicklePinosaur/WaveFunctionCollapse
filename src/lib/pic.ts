interface Color { //possibly convert to class so we can validate the values
    r: number,
    g: number,
    b: number
}

class Pic {

    width: number
    height: number
    pixels: Color[]

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new Array(width*height).fill({r: 0, g: 0, b:0});
    }

    getAt(x: number, y: number): Color {
        return this.pixels[y][x];
    }

    writeAt(x: number, y: number, color: Color): void {
        this.pixels[y][x] = color;
    }
}