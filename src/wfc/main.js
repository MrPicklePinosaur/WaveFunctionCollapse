"use strict";
exports.__esModule = true;
//import ImageProcessor from "src/new/ImageProcessor.js";
var ImageProcessor_js_1 = require("../new/ImageProcessor.js");
function drawSprite(pixels, width, height, canvas, scale) {
    canvas.width = width * scale;
    canvas.height = height * scale;
    var cx = canvas.getContext('2d');
    for (var y = 0, i = 0; y < height; y++) {
        for (var x = 0; x < width; x++, i++) {
            cx.fillStyle = pixels[i];
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
var inputWidth = 5;
var inputHeight = 5;
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
    //generate everything
    var ip = new ImageProcessor_js_1["default"](pixels, inputWidth, inputHeight, sliceWidth, sliceHeight);
    drawSprite(pixels, inputWidth, inputHeight, main_canvas, 20);
    //sample each point on sprite and draw it
    sliced_canvas.innerHTML = ''; //clear all child nodes
    for (var i = 0; i < ip.index_table.length; i++) {
        var new_canvas = document.createElement('canvas');
        new_canvas.id = 'sliced-sprite';
        drawSprite(ip.index_table[i], sliceWidth, sliceHeight, new_canvas, 20);
        sliced_canvas.appendChild(new_canvas);
    }
});
