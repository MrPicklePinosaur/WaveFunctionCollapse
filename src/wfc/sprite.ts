
export default class Sprite {

    width: number;
    height: number;
    pixels: string[];
    wrapSprite: boolean;

    constructor(width: number, height: number, pixels?: string[], wrapSprite?: boolean) {
        this.width = width;
        this.height = height;
        this.pixels = pixels || Sprite.emptyPixels(width,height);
        this.wrapSprite = wrapSprite || false;
    }

    static emptyPixels(width: number, height: number): string[] {
        var arr = new Array<string>(width*height);
        for (var i = 0; i < width*height; i++) {
            arr[i] = '#000000';
        }
        return arr
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
    slice(x: number, y: number, width: number, height: number): Sprite {
        var self = this;
        var sliced = new Array();

        
        var y_ind = y;
        for (var j = 0; j < height; j++) {
            
            var x_ind = x;
            for (var i = 0; i < width; i++) {

                var ind = x_ind+y_ind*self.width;
                sliced.push(self.pixels[ind]);

                x_ind += 1;
                if (x_ind > self.width-1) { x_ind -= self.width; } //wrap back around to left
            }

            y_ind += 1;
            if (y_ind > self.height-1) { y_ind -= self.height; } //wrap back around to top
        }

        return new Sprite(width,height,sliced);
    }

    static compare(a: Sprite, b: Sprite): boolean { //compares the pixel data
        //if the sprites arent even the same size
        if (a.pixels.length != b.pixels.length) { return false; }

        for (var i = 0; i < a.pixels.length; i++) {
            if (a.pixels[i] != b.pixels[i]) { return false; }
        }
        return true;
    }
}