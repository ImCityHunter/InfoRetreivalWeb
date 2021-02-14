

export const stopList = [];
export const TagsNotNeeded = new Set ( ["RECORDNUM","PAPERNUM","MEDLINENUM","AUTHORS","TITLE","SOURCE","MAJORSUBJ","MINORSUBJ","TOPIC","CITE","REFERENCES","AUTHOR","CITATIONS"]);

export const TagsNeeded = new Set(["RECORDNUM","ABSTRACT","EXTRACT", "QueryText"]);
/*
* array of object (each object contains word, and list of record of indexes in sequences)
* [
*   {"key":"coop", value: indexs:[0,2,3,5]}
*   {"key":"mayflower", value: indexs:[0,2,3,5]}
* ]
* */
export const inverted_indexes = {};
export default {
    stopList, TagsNotNeeded, TagsNeeded, inverted_indexes
}
