"use strict";
exports.__esModule = true;
//looks in four directions and returns valid indicies
function getIndiciesAround(index, width, height, wrapping) {
    var output = {};
    ["RIGHT", "LEFT", "DOWN", "UP"].forEach(function (d) {
        var ind = getIndexInDirection(index, width, height, d, wrapping);
        if (ind != -1) {
            output[d] = ind;
        }
        ;
    });
    return output;
}
exports.getIndiciesAround = getIndiciesAround;
function getIndexInDirection(index, width, height, direction, wrapping) {
    var outOfBoundsReturnValue = -1; //what to return if tile we are trying to access goes of the sprite
    if (direction === "RIGHT") {
        if (wrapping) {
            outOfBoundsReturnValue = index + 1 - width;
        }
        return (index % width) + 1 < width ? index + 1 : outOfBoundsReturnValue;
    }
    else if (direction === "LEFT") {
        if (wrapping) {
            outOfBoundsReturnValue = index - 1 + width;
        }
        return (index % width) - 1 >= 0 ? index - 1 : outOfBoundsReturnValue;
    }
    else if (direction === "DOWN") {
        if (wrapping) {
            outOfBoundsReturnValue = index + width - width * height;
        }
        return (index + width < width * height) ? index + width : outOfBoundsReturnValue;
    }
    else if (direction === "UP") {
        if (wrapping) {
            outOfBoundsReturnValue = index - width + width * height;
        }
        return (index - width >= 0) ? index - width : outOfBoundsReturnValue;
    }
    return -1;
}
exports.getIndexInDirection = getIndexInDirection;
function filledArray(value, length) {
    var out = new Array();
    for (var i = 0; i < length; i++) {
        out.push(value);
    }
    return out;
}
exports.filledArray = filledArray;
function compareArray(a, b) {
    if (a.length != b.length) {
        return false;
    }
    for (var i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}
exports.compareArray = compareArray;
//finds index of array inside parent array
function findNestedArray(parent, target) {
    for (var i = 0; i < parent.length; i++) {
        if (compareArray(target, parent[i])) {
            return i;
        }
    }
    return -1;
}
exports.findNestedArray = findNestedArray;
//checks to see if at least one value in one array is in another
function atLeastOneIn(arr, target) {
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var v = arr_1[_i];
        if (target.indexOf(v) > -1) {
            return true;
        }
    }
    return false;
}
exports.atLeastOneIn = atLeastOneIn;
function logb2(x) {
    return Math.log(x) / Math.log(2);
}
exports.logb2 = logb2;
