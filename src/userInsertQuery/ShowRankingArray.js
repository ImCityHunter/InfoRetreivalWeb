import React from "react";



const ShowRankingArray = ({array}) =>

    <div className={`row`}>
        <div className={`col-3 list-group-item`}>Top Ranked Result</div>
        <div className={`col list-group-item text-wrap text-left`}>{array.toString()}</div>
    </div>

export default ShowRankingArray;