
export default class Sprite {

    width: number;
    height: number;
    pixels: string[];

    constructor(width: number, height: number, pixels?: string[]) {
        this.width = width;
        this.height = height;
        this.pixels = pixels || Sprite.emptyPixels(width,height);
    }

    static emptyPixels(width: number, height: number): string[] {
        // var arr = new Array<string>(width*height);
        // for (var i = 0; i < width*height; i++) {
        //     arr[i] = '#000000';
        // }
        // return arr
        return new Array<string>(width*height).fill('#000000');
    } 

    getPixel(x: number, y: number): string {
        var self = this;
        var ind = x + y*self.width;
        if (ind < 0 || ind > self.width*self.height) {
            console.warn(`Invalid position on sprite: (${x},${y})`);
            return '#000000';
        }
        return self.pixels[ind];
    }

    setPixel(x: number, y: number, color: string): void {
        var self = this;
        var ind = x + y*self.width;
        if (ind < 0 || ind > self.width*self.height) {
            console.warn(`Invalid position on sprite: (${x},${y})`);
            return;
        }
        self.pixels[ind] = color;
    }

    //width and height must be positive
    slice(x: number, y: number, sliceWidth: number, sliceHeight: number): string[] {
        var self = this;

        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            console.warn(`INVALID SLICE PARAMETERS ${x},${y},${sliceWidth},${sliceHeight}`);
            return [];
        }

        var sliced = new Array();

        var y_ind = y;
        for (var j = 0; j < sliceHeight; j++) {
            
            var x_ind = x;
            for (var i = 0; i < sliceWidth; i++) {

                var ind = x_ind+y_ind*self.width;
                sliced.push(self.pixels[ind]);

                x_ind += 1;
                if (x_ind > self.width-1) { x_ind -= self.width; } //wrap back around to left
            }

            y_ind += 1;
            if (y_ind > self.height-1) { y_ind -= self.height; } //wrap back around to top
        }

        return sliced;
    }

    //NOTE: Dont use this, instead use the compare array function from utils
    // static compare(a: string[], b: string[]): boolean { //compares the pixel data
    //     //if the sprites arent even the same size
    //     if (a.length != b.length) { return false; }

    //     for (var i = 0; i < a.length; i++) {
    //         if (a[i] != b[i]) { return false; }
    //     }
    //     return true;
    // }

}