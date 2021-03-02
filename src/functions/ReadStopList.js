import React from 'react';
import raw from '../stoplist/stoplist.txt';
import {stopList} from '../variables/variables';

/**
 * this function is called first, read the stopList text and form an array
 */
export const readStopList = () => {
    let list = []
    fetch(raw)
        .then(r => r.text())
        .then(text => {
            const lines = text.split(/\r\n|\n/); //regex
            lines.forEach((line)=>{
                stopList.push(line);
            })
            return stopList;
        });
}

export default {
    readStopList, stopList
}