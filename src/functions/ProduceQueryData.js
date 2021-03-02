

import {buildQueryTF, getTopResult} from '../functions/Ranking'
import {convertArray} from './Utilities';
import {allQueries} from "../variables/variables";

/**
 * calculate all precisoion@10 for all queries
 * @returns {[]}
 */
export const buildP10GraphData = () => {
    const expected =  allQueries;
    let data = [];

    if(Object.keys(allQueries).length<10){
        alert('javascript synchronis error. reload ');
    }

    for (let i in allQueries){
        let queryNum = allQueries[i].queryNum;
        calculatePrecisionAndRecall(expected, queryNum, 10).then((pair)=>{
            data.push(pair);
            //console.log(pair);
        });
    }
    return data;

}

/**
 * This function is capable of calculating Precision and Recall with any given K
 * @param expected
 * @param queryNum
 * @param k
 * @returns {Promise<Object>}
 */
export const calculatePrecisionAndRecall = async (expected, queryNum, k) => {
    //await readQueryXMLFile();

    let actual = {};
    let allRelevant = expected[queryNum].maxResults;

    let queryText = expected[queryNum].queryText;
    actual = getTopResult(queryText, k);


    let tmpActual = convertArray(actual);
    let expectedDocs = expected[queryNum].expectedDocs;

    // if(k>9){
    //     console.log('actual', actualTop);
    //     console.log('expectedTop', expectedDocs);
    // }

    let relevantRetrieved = 0;
    for (let i = 0; i<k && i<tmpActual.length; i++){
        if(expectedDocs.includes(tmpActual[i],0)){
            relevantRetrieved++;
        }
    }
    let precision = relevantRetrieved/k;
    let recall = relevantRetrieved / (allRelevant);

    //console.log('queryNum',queryNum,'k',k,"precision: ",precision, 'recall', recall);

    let result = new Object();
    result.precision = precision.toFixed(4);
    result.recall = recall.toFixed(4);
    result.queryNum = queryNum;


    // console.log(result);
    return result;
}

/**
 * find the mean average P10 for all 100 queries (MAP@10)
 * iterate each iterate from k=1 to k=10, and sum of the result and divide to get the average
 */
export const mapAverageP10 = () =>{
    const expected =  allQueries;
    alert("calculating, give it a sec");
    /**
     *
     * apk = {
     *     queryNum = {
     *         sum : **cumulative sum**
     *         p@1 :  ,
     *         p@2 :  ,
     *         ...
     *
     *         p@10 :
     *     }
     *
     * }
     */
    const apk = {};
    let mapK = 0;
    for(let k = 1; k<=10; k++){
        for (let i in allQueries){
            let queryNum = allQueries[i].queryNum;

            if(apk[queryNum] == undefined){ // init
                apk[queryNum] = new Object();
                apk[queryNum].queryNum = queryNum;
                apk[queryNum].sum = 0;
            }

            calculatePrecisionAndRecall(expected, queryNum, k).then((pair)=>{
                apk[queryNum][k] = pair.precision/k; // p@k
                apk[queryNum].sum = apk[queryNum].sum + apk[queryNum][k]; // sum p@k

                if(k == 10){
                    mapK = mapK + apk[queryNum].sum/10; //ap@10 for all
                }

                if(k == 10 && i == Object.keys(allQueries).length-1 ){ // divide ap@10 by number of queries
                    mapK = mapK / Object.keys(allQueries).length;
                    alert('mapK :' +mapK);
                    return mapK;
                }

            });
        }
    }
}

/**
 * basically, builds all the precision-recall data point until all items have read
 * then sort the result by recall in ascending order with precision
 * then produce two arrays with them,
 *
 * then
 * @param data
 * @returns {[]}
 */
export const calculateInterpolated =()=>{
    const result = {} //  { [recall, precision], [recall, precision],...}
    const toBeConverted = {};
    const expected = allQueries;
    for (let i in allQueries){
        let queryNum = allQueries[i].queryNum;
        if(result[queryNum]==undefined){
            result[queryNum] = [];
            toBeConverted[queryNum] = [];
        }
        let queryText = allQueries[i].queryText;
        let expectedDocs = expected[queryNum].expectedDocs;
        let actual = buildQueryTF(queryText); // [ {docId, score}, {docId, score}, ... ]
        let actualDocs = convertArray(actual); // [ docId, ... ] decsending order based on score
        let relevantRetrieved = 0;

        for(let k = 1; k<actualDocs.length && relevantRetrieved < expectedDocs.length; k++){
            if(expectedDocs.includes(actualDocs[k],0)){
                relevantRetrieved++;
            }
            // result[queryNum][k] = {} //init
            let precision = relevantRetrieved/k;
            let recall = relevantRetrieved/expectedDocs.length;
            result[queryNum].push([k, recall, precision]);

            if(k == actualDocs.length-1  || relevantRetrieved == expectedDocs.length){
                result[queryNum].sort(function(first , second){
                    return first[1] - second[1];
                })
            }
        }

    }
    return buildInterpolatedArray(result);
}

/**
 *
 * At each increasing 0.1 recall, find the highest precision value in the remaining array
 * then
 * @param data
 * @returns {[]}
 */

export const buildInterpolatedArray  = (data) => {

    let result = {};

    for(let queryNum in data){

        let set = new Set();
        if(result[queryNum]==undefined){
            result[queryNum] = [[0.0, 1]];
        }

        let recallArr = buildArrays(data[queryNum], 1); // recall is stored at 1
        let precisionArr = buildArrays(data[queryNum], 2); // precision is stored 2

        let arrLength = recallArr.length;

        let start = 0.1;
        for(let i in recallArr){
            if(!set.has(start) && recallArr[i]>=start && start<=1.0){
                let maxPrecision = getMaxPrecision(precisionArr, i, arrLength); // max precision from here to end
                result[queryNum].push([start, maxPrecision]);
                set.add(start);
                start = start + 0.1;
            }
        }
    }

    let avgInterpolate = [];

    for (let i = 0; i<11; i++){

        let count = 0;
        let sum = 0;
        let recall = 0.0;
        for ( let queryNum in result){
            if(result[queryNum].length > i){
                sum = sum + result[queryNum][i][1]; // add where precision is stored
                count++;
                recall = result[queryNum][i][0];
                //console.log(result[queryNum][i][1]);
            }
        }
        avgInterpolate.push({'recall': recall.toFixed(2), 'interpolate':sum/count});
    }
    //console.log(avgInterpolate);
    return avgInterpolate;
}

/**
 * convert dictionary of arrays to one array given index
 * @param arr
 * @param pos
 * @returns {[]}
 */
export const buildArrays = (arr, pos) =>{
    let result = []
    for(let i in arr){
        result.push([arr[i][pos]]);
    }
    return result;
}


/**
 * get max value from the remaining array
 * @param arr
 * @param begin
 * @param end
 * @returns {number}
 */

function getMaxPrecision(arr, begin, end) {
    arr = [].slice.apply(arr, [].slice.call(arguments, 1));
    return Math.max.apply(Math, arr)
}








export default {
    buildP10GraphData, mapAverageP10, calculateInterpolated
}



