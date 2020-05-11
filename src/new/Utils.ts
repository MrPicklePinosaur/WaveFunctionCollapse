
type Direction = "RIGHT" | "LEFT" | "DOWN" | "UP";

//looks in four directions and returns valid indicies
function getIndiciesAround(index: number, width: number, height: number, wrapping: boolean): Object { 

    var output = {};

    ["RIGHT","LEFT","DOWN","UP"].forEach(d => {
        var ind = getIndexInDirection(index,width,height,<Direction> d,wrapping);
        if (ind != -1) { output[d] = ind; };
    });

    return output;
}

function getIndexInDirection(index: number, width: number, height: number, direction: Direction, wrapping: boolean): number {

    var outOfBoundsReturnValue = -1; //what to return if tile we are trying to access goes of the sprite

    if (direction === "RIGHT") {

        if (wrapping) { outOfBoundsReturnValue = index+1-width; } 
        return (index%width)+1 < width ? index+1 : outOfBoundsReturnValue;

    } else if (direction === "LEFT") {

        if (wrapping) { outOfBoundsReturnValue = index-1+width; }
        return (index%width)-1 >= 0 ? index-1 : outOfBoundsReturnValue;

    } else if (direction === "DOWN") {

        if (wrapping) { outOfBoundsReturnValue = index+width-width*height; }
        return (index+width < width*height) ? index+width : outOfBoundsReturnValue;

    } else if (direction === "UP") {

        if (wrapping) { outOfBoundsReturnValue = index-width+width*height}
        return (index-width >= 0) ? index-width : outOfBoundsReturnValue;
        
    }

    return -1;

}

function filledArray<T>(value: T, length: number): Array<T> {
    var out = new Array<T>();
    
    for (var i = 0; i < length; i++) {
        out.push(value);
    }
    return out;
}

function compareArray<T>(a: Array<T>, b: Array<T>): boolean { //comapres contents of array
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

function logb2(x : number): number {
    return Math.log(x) / Math.log(2);
}


export default Direction;
export { getIndiciesAround, getIndexInDirection, filledArray, compareArray, findNestedArray, logb2 }