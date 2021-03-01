import React from 'react';
import {stopList, inverted_indexes, TagsNeeded, cfcFiles, sorted, documentsData} from '../variables/variables';
import {calculateRunningTime} from "./CalculateMemorySpaceAndTime";

export const readAllXmlFiles = () =>{
    //new_inverted_indexes(); // clear all key-value pair
    let begin = new Date();
    cfcFiles.forEach((cfcFile)=>
        fetch(cfcFile)
            .then(cfcFile => cfcFile.text())
            .then(text => {
                parseXML(text);
        }));

    for(const key in inverted_indexes) {
        sorted[sorted.length] = key;
    }
    sorted.sort();
    //console.log(sorted);
    let end = new Date();
    calculateRunningTime(begin, end);
    return sorted;
}


export const parseXML = (insertFile) => {

    // getDomParsers
    const parser = new DOMParser();
    const dom = parser.parseFromString(insertFile, "application/xml");

    let records = new Set();
    records = dom.getElementsByTagName("RECORD");

    // find needed tags
    let autoGeneratedId = 0;
    for (const record of records){
        let record_id = record.getElementsByTagName("RECORDNUM")[0] == undefined ? autoGeneratedId : record.getElementsByTagName("RECORDNUM")[0].childNodes[0].data;
        autoGeneratedId++; // increment autoGeneratedId to record the sequence of doc being read
        for (const tag of record.getElementsByTagName("*")){
            let tagName = tag.tagName;
            if(TagsNeeded.has(tagName)){ // if tag is in the NotNeeded set, tokenize it
                tokenizing(record_id, record.getElementsByTagName(tagName)[0].childNodes[0].data)
            }
        }
    }


}

export const checkExtension = (file) => {
    const extension = file.target.files[0].name.match(/\.[0-9a-z]+$/i);
    if (extension!=".xml"){ //alert if inserted file is not an xml file
        alert("this is not an xml file");
    }
}

export const checkApostrophe = (word) => {
    return word.match(/\'/);
}


export const tokenizing = (record_id, paragraph) => {
    let words = paragraph.split(/[\[\]<>.,\/#!$%\^&\*;:{}=_()?@\s\"]/g); //split paragraphs by punctuation marks and space(s)
    let temp = [];
    for (let word of words){
        word = word.toLowerCase();
        word = word.replace(/[_~\d+]/g,"") // remove hyphens and digits
        if(word == null || word.length==0 || stopList.includes(word)){ // default check
            continue;
        }
        else if (checkApostrophe(word)){ // if a word has apostrophes, ignore for now
            continue;
        }
        else if(word.match('\-')){
            let tmp2 = word.split(/\-/);
            let tmp3 = word.replace(/\`/,'');
            let combinedWord = false;
            for(let i = 0; i<tmp2.length;i ++){
                if(tmp2[i] in inverted_indexes && tmp2[i].length>1){
                    // split word by hyphens
                    // only add word if has been seen before
                    // this method has flaws, but it should help indexing
                    temp.push({"_id":record_id, "word":tmp2[i]});
                    combinedWord = true;
                }
            }
            if(!combinedWord){
                temp.push({"_id":record_id, "word":tmp3});
            }
        }
        else{
            temp.push({"_id":record_id, "word":word}); // make a copy of the needed word only
        }
    }

    for(let pair of temp){
        let record_id = pair._id;
        let word = pair.word;

        indexing(record_id, word); // set up a map for each word
        setupDocumentsData(record_id, word, temp.length); // set up a map for each doc
    }

    //console.log(documentsData);
}

// set up TF
export const setupDocumentsData = (record_id, word, size) =>{
    //let document = (record_id in documentsData) ? documentsData[record_id]: new Object(); // init

    if(documentsData[record_id] === undefined){
        documentsData[record_id] = new Object();
        documentsData[record_id].docId = record_id;
    }

    documentsData[record_id].totalSize = size;

    // initialize key-value dictionary
    documentsData[record_id].termFrequency = ( documentsData[record_id].termFrequency === undefined) ? new Object(): documentsData[record_id].termFrequency;

    // initialize a key-value pair within the dict
    documentsData[record_id].termFrequency[word] = (documentsData[record_id].termFrequency[word] === undefined) ? new Object(): documentsData[record_id].termFrequency[word];

    // initialize the word count
    documentsData[record_id].termFrequency[word].count = (documentsData[record_id].termFrequency[word].count === undefined) ? 0: documentsData[record_id].termFrequency[word].count;

    // increase word count
    documentsData[record_id].termFrequency[word].count++; // increment

    // re-calculate the Normalization of term frequency
    documentsData[record_id].termFrequency[word].ntf =  documentsData[record_id].termFrequency[word].count / documentsData[record_id].totalSize; //increment

}



export const indexing = (record_id, word) => {
    let list = (word in inverted_indexes) ? inverted_indexes[word]:[];
    if (!list.includes(record_id)){
        list.push(record_id);
        inverted_indexes[word] = list;
    }
}

export default {
    parseXML, readAllXmlFiles
}