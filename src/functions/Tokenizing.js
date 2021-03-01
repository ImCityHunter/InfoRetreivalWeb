import {inverted_indexes, stopList} from "../variables/variables";

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
        else if(word.match('\-')){
            let tmp2 = word.split(/\-/);
            let tmp3 = word.replace(/\`/,'');
            let combinedWord = false;
            for(let i = 0; i<tmp2.length;i ++){
                if(tmp2[i] in inverted_indexes){
                    // only add word if has been seen before
                    // this method has flaws, but it should help indexing
                    temp.push(tmp2[i]);
                    combinedWord = true;
                }
            }
            if(!combinedWord){
                temp.push(tmp3);
            }
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