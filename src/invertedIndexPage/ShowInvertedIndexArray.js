import React from "react";



const ShowInvertedIndexArray = ({word, array}) =>

    <div className={`row`}>
        <div className={`col-3 list-group-item`}>{word}</div>
        <div className={`col-9 list-group-item text-left text-wrap`}>{array.toString()}</div>
    </div>

export default ShowInvertedIndexArray;