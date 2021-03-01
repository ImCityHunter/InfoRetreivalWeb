/**
 * convert an 2-d array of [ranked docId, score] to just [docId]
 * @param array
 * @returns {[]}
 */
export const convertArray = (array) =>{
    let result = []
    for (let i = 0; i < array.length; i++) {
        let tmp = (array[i][0].isInteger)?array[i][0]:parseInt(array[i][0]);
        result.push(tmp); //ensure int
        //console.log(array[i][0]);
    }
    return result
}

export default {
    convertArray
}