//import WFC from "./wfc.js";
//import Sprite from "./sprite.js";
/// <reference path="./sprite.js" />
/// <reference path="./wfc.js" />
function drawSprite(sprite, canvas, scale) {
    canvas.width = sprite.width * scale;
    canvas.height = sprite.height * scale;
    var cx = canvas.getContext('2d');
    for (var y = 0; y < sprite.height; y++) {
        for (var x = 0; x < sprite.width; x++) {
            cx.fillStyle = sprite.getPixel(x, y);
            cx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}
var black = '#000000';
var red = '#FF0000';
var green = '#00FF00';
var blue = '#0000FF';
var pixels = [
    red, red, red, red, red,
    black, black, black, black, black,
    blue, blue, blue, blue, blue,
    black, black, black, black, black,
    green, green, green, green, green,
];
var s = new Sprite(5, 5);
var wfc = new WFC(s);
console.log(wfc.imageProcessor(3, 3));
drawSprite(s, document.getElementById('main-canvas'), 5);
