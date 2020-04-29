"use strict";
exports.__esModule = true;
var sprite_js_1 = require("./sprite.js");
var wfc_js_1 = require("./wfc.js");
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
var bluish = '#0073FF';
/*var pixels = [
    red, red, red, red, red,
    black, black, black, black, black,
    blue, blue, blue, blue, blue,
    black, black, black, black, black,
    green, green, green, green, green,
];
*/
var pixels = [
    black, bluish, black, black, black,
    black, bluish, black, black, black,
    black, bluish, black, black, black,
    bluish, bluish, bluish, bluish, bluish,
    black, bluish, black, black, black,
];
var main_canvas = document.getElementById('main-canvas');
var sliced_canvas = document.getElementById('sliced-canvas');
var wfc_form = document.querySelector("form"); //only works cuz its the only form
//preliminary stuff
wfc_form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    //get some form data
    var data = new FormData(wfc_form);
    var sliceWidth = +data.get('slice-width'); //convert to number
    var sliceHeight = +data.get('slice-height');
    //console.log({sliceWidth, sliceHeight, spriteWrap});
    //generate everything
    var s = new sprite_js_1["default"](5, 5, pixels);
    var wfc = new wfc_js_1["default"](s, sliceWidth, sliceHeight, 20, 20);
    drawSprite(s, main_canvas, 20);
    wfc.imageProcessor();
    wfc.computeFrequencyHints();
    wfc.collapse();
    console.log(wfc.calculateEntropyAt(0, 0));
    //sample each point on sprite and draw it
    sliced_canvas.innerHTML = ''; //clear all child nodes
    for (var i = 0; i < wfc.tile_table.length; i++) {
        //console.log(wfc.adjacency[i]);
        var new_canvas = document.createElement('canvas');
        new_canvas.id = 'sliced-sprite';
        drawSprite(new sprite_js_1["default"](sliceWidth, sliceHeight, wfc.tile_table[i]), new_canvas, 20);
        sliced_canvas.appendChild(new_canvas);
    }
});
