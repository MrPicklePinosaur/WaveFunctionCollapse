
export default class Sprite {

    width: number;
    height: number;
    pixels: string[];

    constructor(width: number, height: number, pixels?: string[]) {
        this.width = width;
        this.height = height;
        this.pixels = pixels || new Array(width*height).fill('#000000');
    }

    getPixel(x: number, y: number): string {
        var ind = x + y*this.width;
        if (ind < 0 || ind > this.width*this.height) {
            console.warn(`Invalid position on sprite: (${x},${y})`);
            return '#000000';
        }
        return this.pixels[ind];
    }

    setPixel(x: number, y: number, color: string): void {
        var ind = x + y*this.width;
        if (ind < 0 || ind > this.width*this.height) {
            console.warn(`Invalid position on sprite: (${x},${y})`);
            return;
        }
        this.pixels[ind] = color;
    }

    //width and height must be positive
    slice(x: number, y: number, width: number, height: number): Sprite {
        var sliced = new Array();

        /*
        var w_inc = width/Math.abs(width); //find if width and height are negative
        var h_inc = height/Math.abs(height);
        */

        var y_ind = y;
        for (var j = 0; j < height; j++) {

            y_ind += 1;
            if (y_ind > this.height) { y -= height; } //wrap back around to top
            
            var x_ind = x;
            for (var i = 0; i < width; i++) {

                x_ind += 1;
                if (x_ind > this.width) { x_ind -= width; } //wrap back around to left

                var ind = x_ind+y_ind*width;
                sliced.push(this.pixels[ind]);
            }
        }

        return new Sprite(width,height,sliced);
    }
}