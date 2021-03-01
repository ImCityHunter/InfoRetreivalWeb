import {stopList} from "../variables/variables";

export const checkApostrophe = (word) => {
    return word.match(/\'/);
}


export const tokenizingQuery = (queryText) => {
    let words = queryText.split(/[\[\]<>.,\/#!$%\^&\*;:{}=_()?@\s\"]/g); //split paragraphs by punctuation marks and space(s)
    let temp = [];
    for (let word of words){
        word = word.toLowerCase();
        word = word.replace(/[\-_~\d+]/g,"") // remove hyphens and digits
        if(word == null || word.length==0 || stopList.includes(word)){ // default check
            continue;
        }
        else if (checkApostrophe(word)){ // if a word has apostrophes, ignore for now
            continue;
        }
        else{
            temp.push(word); // make a copy of the needed word only
        }
    }
    return temp;
}

export default {
    tokenizingQuery
}