
import cf74 from '../cfcFiles/cf74.xml';
import cf75 from '../cfcFiles/cf75.xml';
import cf76 from '../cfcFiles/cf76.xml';
import cf77 from '../cfcFiles/cf77.xml';
import cf78 from '../cfcFiles/cf78.xml';
import cf79 from '../cfcFiles/cf79.xml';

export const cfcFiles = [cf74, cf75, cf76, cf77, cf78, cf79];

/**
 *
 * @type {{
 *     {"key": docId, "value":{
 *                              totalLength: 0,
 *                              termFrequency:{
 *                                      word: count
 *                              }
 *     }}
 *
 * }}
 */
export const documentsData = {};


export const WordIDF = {};

export const RecordIDFSum = {};

export const getSorted = () =>  sorted;

export const allQueries = {};

export const sorted = [];
export const stopList = [];

export const TagsNeeded = new Set(["ABSTRACT","EXTRACT", "TITLE", "TOPIC","AUTHOR"]);

/*
* object (each object contains word, and list of record of indexes in sequences)
* [
*   {"key":"coop", value: indexs:[0,2,3,5]}
*   {"key":"mayflower", value: indexs:[0,2,3,5]}
* ]
* */
export const inverted_indexes = {};

export const new_inverted_indexes = () =>{
    for(var key in inverted_indexes) {
        if(inverted_indexes.hasOwnProperty(key)) {
            delete inverted_indexes[key];
        }
    }
}

export const special_cases = {};


export default {
    stopList, TagsNeeded, inverted_indexes,
    new_inverted_indexes, cfcFiles, sorted,
    documentsData, WordIDF, getSorted, RecordIDFSum
}
