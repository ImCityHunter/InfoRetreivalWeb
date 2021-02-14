import React from "react";
const ShowInvertedIndex = ({word, array}) =>

    <div className={`row`}>
        <div className={`col-3 list-group-item`}>{word}</div>
        <div className={`col list-group-item wrapped_my_text text-left`}>{array.toString()}</div>
    </div>

export default ShowInvertedIndex;