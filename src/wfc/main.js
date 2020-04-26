"use strict";
exports.__esModule = true;
var sprite_js_1 = require("./sprite.js");
var wfc_js_1 = require("./wfc.js");
// <reference path="./sprite.js" />
// <reference path="./wfc.js" />
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
var s = new sprite_js_1["default"](5, 5, pixels, true);
var wfc = new wfc_js_1["default"](s);
drawSprite(s, document.getElementById('main-canvas'), 20);
var sliced = wfc.imageProcessor(3, 3);
console.log(sliced);
var sliced_div = document.getElementById('sliced-div');
for (var i = 0; i < sliced.length; i++) {
    var new_canvas = document.createElement('canvas');
    new_canvas.id = 'sliced-sprite';
    drawSprite(sliced[i], new_canvas, 20);
    sliced_div.appendChild(new_canvas);
}
