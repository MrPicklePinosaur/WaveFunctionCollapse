import React, { Component } from 'react';
import ImageProcessor from '../core/ImageProcessor'

var black = '#000000';
var red = '#FF0000';
var green = '#00FF00';
var blue = '#0000FF';
var bluish = '#0073FF';

class Home extends Component {

    state = {
        pixels: [ 
            black, bluish, black, black, black,
            black, bluish, black, black, black,
            black, bluish, black, black, black,
            bluish, bluish, bluish, bluish, bluish,
            black, bluish, black, black, black,
        ],
        inputWidth: 5,
        inputHeight: 5,
        sliceWidth: 3,
        sliceHeight: 3,
        canvasScale: 10,
    }

    render() {
        const subSpriteList = 
            this.getSubSprites().map(spriteData => {
                return (
                    <canvas
                        width={this.state.sliceWidth} 
                        height={this.state.sliceHeight} 
                    >

                    </canvas>
                );
            })

        return (
            <div>
                <div>
                    { subSpriteList }
                </div>
            </div>
        );
    }

    getSubSprites = (): Array<string[]> => {

        var ip = new ImageProcessor(this.state.pixels,5,5,3,3);
        console.log(ip.indexedSprite);
        console.log(ip.index_table)
        return ip.index_table;

    }

}

export default Home;