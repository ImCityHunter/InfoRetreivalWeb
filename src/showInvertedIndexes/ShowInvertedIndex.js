import React from "react";
const ShowInvertedIndex = ({word, array}) =>

    <div className={`row`}>
        <div className={`col-3 list-group-item`}>{word}</div>
        <div className={`col list-group-item text-wrap text-left`}>{array.sort().toString()}</div>
    </div>

export default ShowInvertedIndex;