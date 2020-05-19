
//import ImageProcessor from "src/new/ImageProcessor.js";
import ImageProcessor from "../new/ImageProcessor.js";
import WaveFunction from "../new/WaveFunction.js";

function drawSprite(pixels: string[], width: number, height: number, canvas: any, scale: number) {
    canvas.width = width * scale;
    canvas.height = height * scale;
    let cx = canvas.getContext('2d');

    for (var y = 0, i = 0; y < height; y++) {
        for (var x = 0; x < width; x++, i++) {
            cx.fillStyle = pixels[i];
            cx.fillRect(x*scale,y*scale,scale,scale);
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

const main_canvas = document.getElementById('main-canvas');
const sliced_canvas = document.getElementById('sliced-canvas');
const output_canvas = document.getElementById('output-canvas');
const wfc_form = document.querySelector("form"); //only works cuz its the only form

//preliminary stuff
wfc_form.addEventListener('submit', (evt) => {
    evt.preventDefault(); 

    //get some form data
    const data = new FormData(wfc_form);

    var sliceWidth: number = +(data.get('slice-width') as string); //convert to number
    var sliceHeight: number = +(data.get('slice-height') as string);

    var outputWidth = 10;
    var outputHeight = 10;

    //generate everything
    var ip = new ImageProcessor(pixels,inputWidth,inputHeight,sliceWidth,sliceHeight);
    var index_table = ip.index_table;
    var frequency = ip.calculateFrequencyHints();
    var adjacency = ip.calculateAdjacencyRules();

    var wf = new WaveFunction(outputWidth,outputHeight,index_table,frequency,adjacency);
    
    var collapsed_sprite = wf.waveFunctionCollapse();

    drawSprite(pixels,inputWidth,inputHeight,main_canvas,20);

    
    //sample each point on sprite and draw it
    sliced_canvas.innerHTML = ''; //clear all child nodes
    for (var i = 0; i < ip.index_table.length; i++) {

        var new_canvas = document.createElement('canvas');
        new_canvas.id = 'sliced-sprite';
        drawSprite(ip.index_table[i],sliceWidth,sliceHeight,new_canvas,20);
        sliced_canvas.appendChild(new_canvas);
    }

    //OUTPUT SPRITE:
    //now take the top left corner of each sprite and draw it
    var output_pixels = [];

    for (var tile of collapsed_sprite) {
        var topleftpixel = index_table[tile][0];
        output_pixels.push(topleftpixel);
    }

    drawSprite(output_pixels,outputWidth,outputHeight,output_canvas,20);


});