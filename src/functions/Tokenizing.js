import {inverted_indexes, stopList} from "../variables/variables";

/**
 *
 * @param word
 * @returns {string[] | boolean | void | SnapshotReturnOptions | RegExpMatchArray | Promise<Response | undefined> | *}
 */
const checkApostrophe = (word) => {
    return word.match(/\'/);
}

/**
 *
 * @param word
 * @returns {string[] | boolean | void | SnapshotReturnOptions | RegExpMatchArray | Promise<Response | undefined> | *}
 */
const checkHyphen = (word) => {
    return word.match(/\-/);
}

/**
 *
 * @param word
 * @returns {boolean|boolean}
 */
const checkBasicPlurals = (word) =>{
    return word.length > 3 && (word.slice(-1) == 's' || word.slice(-2) == 'es');
}

/**
 *
 * @param word
 * @returns {boolean|boolean}
 */
const checkPresentTense = (word) => {
    return word.length > 3 && (word.slice(-3) == 'ing');
}

/**
 *
 * @param word
 * @returns {string|*}
 */
const removePresentTense = (word) => { // assume the word end of ing, and see if exist in other form
    let tmp = word.substring(0,word.length-3);
    let tmp2 = word.substring(0,word.length-3).concat('e');
    if(tmp in inverted_indexes){
        return tmp;
    }
    else if(tmp2 in inverted_indexes){
        return tmp2;
    }
    return word;
}

/**
 *
 * @param word
 * @returns {string|*}
 */
const tokenzingPluarals = (word) => {
    let specialCases = ['ss','sh','ch','x','z','s'] // with these cases, plurals have 'es'
    if(word.slice(-1) == 's'){
        let tmp = word.substring(0, word.length-1);
        if (tmp in inverted_indexes){
            return tmp;
        }
    }
    else if(word.slice(-2) == 'es'){
        let tmp = word.substring(0, word.length-2);
        // if the last two character matches, that means it is a plural
        if(specialCases.includes(tmp.slice(-1)) || specialCases.includes(tmp.slice(-2))){
            return tmp;
        }
    }
    else if (word.slice(-3) == 'ies'){ // cities => city
        let tmp = word.substring(0, word.length-3).concat('y');
        if(tmp in inverted_indexes){
            return tmp;
        }
    }
    else if (word.slice(-3) == 'ves'){ // wolf => wolves
        let tmp = word.substring(0, word.length-3).concat('f');
        let tmp2 = word.substring(0, word.length-3).concat('fe');

        if (tmp in inverted_indexes){
            return tmp;
        }
        else if (tmp in inverted_indexes){
            return tmp2;
        }
    }
    return word;
}

/**
 *
 * @param word
 * @returns {Buffer|builders.Concat|any[]|string|*}
 */
const checkEnding = (word)=>{
    let specialCases = ['s','es','ed','ing', 'ly','d']; // possible word ending that has been added
    for(let i = 0; i<specialCases.length; i++){
        let tmp = word.concat(specialCases[i]);
        if(tmp in inverted_indexes){
            return tmp;
        }
    }
    return word;
}

/**
 * if a word has been added in other form, then use that form instead
 * @param word
 * @returns {string|Buffer|builders.Concat|any[]|*}
 */
const hasAddedInOtherForm = (word) =>{

    if(word.slice(-1) == 'y'){
        let tmp = word.substring(0, word.length-1).concat('ies'); // plurals
        let tmp2 = word.substring(0, word.length-1).concat('ily'); // adverbs
        if(tmp in inverted_indexes){
            return tmp;
        }
        if(tmp2 in inverted_indexes){
            return tmp;
        }
    }

    if(word.slice(-2) == 'ly'){ // check adverb
        let tmp = word.substring(0, word.length-2);
        if(tmp in inverted_indexes){
            return tmp;
        }
    }
    if(word.slice(-2) == 'ily'){ // special case for adverb
        let tmp = word.substring(0, word.length-2).concat('y');
        if(tmp in inverted_indexes){
            return tmp;
        }
    }
    if(word.slice(-1) == 'f'){ // special case for plurals
        let tmp = word.substring(0, word.length-1).concat('ves');
        if(tmp in inverted_indexes){
            return tmp;
        }
    }

    if(word.slice(-2) == 'fe'){ //special case for plurals
        let tmp = word.substring(0, word.length-2).concat('ves');
        if(tmp in inverted_indexes){
            return tmp;
        }
    }

    if(word.slice(-3) == 'ing'){ //deal with present tense
        let original = word.substring(0, word.length-3).concat('e'); // citing => cite
        let tmp = checkEnding(original);
        if(tmp in inverted_indexes){
            return tmp;
        }
    }

    if(word.slice(-1) == 'd'){ // maybe a past tense
        let original = word.substring(0, word.length-1);
        let tmp = checkEnding(original); // maybe seen as a plural
        if(tmp in inverted_indexes){
            return tmp;
        }
    }

    if(word.slice(-2) == 'ed'){ // maybe a paste tense
        let original = word.substring(0, word.length-2);
        let tmp = checkEnding(original);
        if(tmp in inverted_indexes){
            return tmp;
        }
    }

    if(word.slice(-2) == 'es'){ // maybe a plural
        let original = word.substring(0, word.length-2);
        let tmp = checkEnding(original);
        if(tmp in inverted_indexes){
            return tmp;
        }
    }

    if(word.slice(-2) == 's'){ // maybe a plural
        let original = word.substring(0, word.length-1);
        let tmp = checkEnding(original);
        if(tmp in inverted_indexes){
            return tmp;
        }
    }

    return checkEnding(word);
}
/**
 *
 * @param text
 * @returns {[]}
 */
export const generalTokenizing = (text)=>{
    // split paragraphs by punctuation marks and space(s)
    let words = text.split(/[\[\]<>.,\/#!$%\^&\*;:{}=_()?@\s\"]/g);

    // init
    let wordArr = [];

    for(let word of words){
        word = word.toLowerCase(); // to lowercase
        word = word.replace(/[\d+]/g,""); // remove digits

        if(word == undefined || word.length < 2 || stopList.includes(word)){
            continue;
        }
        else if(checkApostrophe(word)){
            let tmp = word.split(/\'/);
            if(tmp[0] in inverted_indexes){
                // only add word if has been seen before
                // this method has flaws, but it should help indexing
                // this should be able to deal with Wilsons' => Wilson
                wordArr.push(hasAddedInOtherForm(tmp[0]));
            }
        }
        else if(checkHyphen(word)){
            let tmp = word.split(/\-/);
            for(let i = 0; i<tmp.length;i ++){
                if(tmp[i].length>2){ //remove birth-day to birthday
                    // only add word if has been seen before
                    // this method has flaws, but it should help indexing
                    wordArr.push(hasAddedInOtherForm(tmp[i]));
                }
            }
        }
        else if(checkBasicPlurals(word)){
            wordArr.push(hasAddedInOtherForm(tokenzingPluarals(word)));

        }
        else if (checkPresentTense(word)){ //ing
            wordArr.push(hasAddedInOtherForm(removePresentTense(word)));
        }
        else{
            wordArr.push(hasAddedInOtherForm(word));
        }
    }
    return wordArr;
}


export default {
    generalTokenizing
}