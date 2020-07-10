type AdjacenctIndicies = {
    right?: number,
    left?: number,
    down?: number,
    up?: number
}

type Direction = "RIGHT" | "LEFT" | "DOWN" | "UP";

//looks in four directions and returns valid indicies
function getIndiciesAround(index: number, width: number, height: number, wrapping: boolean): AdjacenctIndicies { 
    
    if (wrapping) {
        return {
            right: (index%width)+1 < width ? index+1 : index+1-width,
            left: (index%width)-1 >= 0 ? index-1 : index-1+width,
            down: (index+width < width*height) ? index+width : index+width-width*height,
            up: (index-width >= 0) ? index-width : index-width+width*height
        }

    } else {
        return {
            right: (index%width)+1 < width ? index+1 : undefined,
            left: (index%width)-1 >= 0 ? index-1 : undefined,
            down: (index+width < width*height) ? index+width : undefined,
            up: (index-width >= 0) ? index-width : undefined
        }

    }

}

function compareArray<T>(a: Array<T>, b: Array<T>): boolean { //comapres contents of array, returns if they are the same
    if (a.length != b.length) { return false; }

    for (var i = 0; i < a.length; i++) {
        if (a[i] != b[i]) { return false; }
    }

    return true;
}

//finds index of array inside parent array
function findNestedArray<T>(parent: Array<Array<T>>, target: Array<T>): number {

    for (var i = 0; i < parent.length; i++) {
        if (compareArray(target,parent[i])) { return i; }
    }

    return -1;
}

//checks to see if at least one value in one array is in another
function atLeastOneIn<T>(arr: Array<T>, target: Array<T>): boolean {
    for (const v of arr) {
        if (target.indexOf(v) > -1) { return true; }
    }
    return false;
}


export default Direction;
export { getIndiciesAround, getIndexInDirection, compareArray, findNestedArray, atLeastOneIn }