import {inverted_indexes, sorted, documentsData, WordIDF, RecordIDFSum} from "../variables/variables";
import {tokenizingQuery} from "./Tokenizing";

/**
 * return top sliced ranked result by K
 * @param queryText
 * @param top
 * @returns {(string|number)[][]}
 */
export const getTopResult = (queryText, k) =>{
    let temp = buildQueryTF(queryText);
    return temp.slice(0,parseInt(k));

}

/**
 * read a query text, and return the terms kept after tokenized
 * and also calculate each terms term frequency (tf)
 * and the end, calculate (tf * idf)
 * @param queryText
 * @returns {(string|number)[][]}
 */
export const buildQueryTF = (queryText) => {
    let words = tokenizingQuery(queryText);
    let queryTF = {};
    for ( let word of words){
        let queryLength = words.length;
        if (WordIDF[word] !== undefined) {
            if (queryTF[word] === undefined){
                queryTF[word] = new Object();
            }
            queryTF[word].count =  (queryTF[word].count === undefined) ? 1:queryTF[word].count++;
            queryTF[word].ntf = queryTF[word].count / queryLength;
            queryTF[word].tfXidf = WordIDF[word].idf * queryTF[word].ntf;
        }
    }

    //console.log('query text key words: ' + Object.keys(queryTF));
    return calculateCosineSimilarity(queryTF);
}

/**
 * calculate cosine similarity between query and each doc/record
 * https://janav.wordpress.com/2013/10/27/tf-idf-and-cosine-similarity/
 *
 * convert ^ into codes below
 * @param queryTF
 * @returns {(string|number)[][]}
 */
export const calculateCosineSimilarity = (queryTF) => {
    let result = {};
    let querySum = 0;

    if(Object.keys(documentsData).length<50 || Object.keys(WordIDF).length<50){
        alert('default documents is not done building. come back later');
    }

    for (let word in queryTF){
        let wordIDF = WordIDF[word].idf;
        let querytfXidf = queryTF[word].tfXidf; // this is already normalized tf * idf
        let query_tfXntf = Math.pow(querytfXidf, 2); // power of 2

        querySum = querySum + query_tfXntf; // || (query)||

        for (let record_id in documentsData) {

            // only add values into || doc ||, if this doc has a term from query
            if(documentsData[record_id].termFrequency[word] !== undefined){

                // init
                if(result[record_id]===undefined){
                    result[record_id] = new Object(); // init
                    result[record_id].docSum = 0;
                    result[record_id].dotProduct = 0;
                    result[record_id].cosine = 0;
                }

                // get the normailzed ntf value that was calculated in each doc
                let record_ntf = (documentsData[record_id].termFrequency[word].ntf === undefined) ? 0: (documentsData[record_id].termFrequency[word].ntf);

                // tf * wordIDF
                let record_tfXntf = record_ntf * wordIDF;

                let doc_tfXntf = Math.pow(record_tfXntf,2);

                result[record_id].docSum = result[record_id].docSum + doc_tfXntf; // || Document ||

                // dot product is query's term's tfIdf * the same term's tfIdf in this record
                result[record_id].dotProduct = result[record_id].dotProduct + (querytfXidf * record_tfXntf) // || dot product
            }

        }
    }

    querySum = Math.sqrt(querySum); // square root the sum of ( query-tf * idf ) ^ 2

    for (let record_id in result){
        result[record_id].cosine = 0; // init
        result[record_id].docSum = Math.sqrt(result[record_id].docSum); // squared root the sum of all (tf * wordIDF) ^2
        result[record_id].cosine = result[record_id].dotProduct / (result[record_id].docSum * querySum)
        //console.log(result[record_id].cosine);
    }
    return sortDictionary(result);
}
/**
 * Build each record's all word's tf * idf sum
 * function is currently not used
 */
export const buildRecordIDFSum = () => {
    setTimeout(()=>{
        if(Object.keys(documentsData).length>50){
            for (let record_id in documentsData) {
                let sum = 0;
                for(let word in documentsData[record_id].termFrequency){
                    let tf = documentsData[record_id].termFrequency[word].ntf;
                    let idf = WordIDF[word].idf;
                    let product = tf * idf;
                    sum = sum + Math.pow(product,2);
                }
                RecordIDFSum[record_id] = {};
                RecordIDFSum[record_id].record_id = record_id;
                RecordIDFSum[record_id].value = Math.sqrt(sum);
            }
            //console.log(RecordIDFSum);
        }
    }, 700);
    return buildRecordIDFSum;

}


/**
 * Build each word's idf
 * @returns {{}}
 */

export const buildWordIDF =  () =>{
    setTimeout(()=>{
        const docNum = Object.keys(documentsData).length;
        console.log("number of record read: "+docNum);
        for(const word in inverted_indexes) {
            let numOfDocWithTerm = inverted_indexes[word].length;
            //console.log(word+' : '+numOfDocWithTerm);
            let idf = 1.0;
            if (numOfDocWithTerm > 0) {
                idf = 1 + Math.log(docNum / numOfDocWithTerm);
                //console.log(idf);
            }
            WordIDF[word] = new Object();
            WordIDF[word].word = word;
            WordIDF[word].idf = idf;
        }
        buildRecordIDFSum();
    }, 500)

    return WordIDF;
}

/**
 * return arrays of [recorid_id, cosine value] in descending order of cosine value
 * @param dicts
 * @returns {[string, number][]}
 */
export const sortDictionary = (dicts) => {

    const temps = Object.keys(dicts).map(function(record_id){
        return [parseInt(record_id), dicts[record_id].cosine];
    })
    temps.sort(function(first, second){
        return second[1] - first[1];
    })
    //console.log(temps);
    //let tmp = parseInt(top) // convert String to Integer
    return temps;
}

export default  {
    buildWordIDF, buildQueryTF, calculateCosineSimilarity, getTopResult, buildRecordIDFSum
}

