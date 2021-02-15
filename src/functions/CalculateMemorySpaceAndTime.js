import React from 'react';

let timeRunning  = 0;
let bytes = 0;
export const calculateRunningTime = (begin, end) => {
    timeRunning = (end - begin)/1000; // miliseconds to seconds
}
export const getRunTime = () => {
    return timeRunning;
}

export const sizeOf = (obj) => {
    if(obj !== null && obj !== undefined) {
        if (typeof obj === 'number')
                bytes += 8;
        else if (typeof obj === 'string')
                bytes += obj.length * 2;
        else if (typeof obj === 'boolean')
                bytes += 4;
        else if (typeof obj === 'object'){
             // if object, run this recursively.
            let objClass = Object.prototype.toString.call(obj).slice(8, -1);
            if(objClass === 'Object' || objClass === 'Array') {
                for(let key in obj) {
                    if(!obj.hasOwnProperty(key)) continue;
                    sizeOf(obj[key]);
                }
            } else bytes += obj.toString().length * 2;
        }
    }
    return bytes
};

export const getMemoryUsed = (obj) => {
    return (sizeOf(obj)/1000).toFixed(3); // bytes to kb is 1/1000
}

export default {
    calculateRunningTime, getMemoryUsed
}