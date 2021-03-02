
import React from 'react';
import {inverted_indexes} from "../variables/variables";
import ShowInvertedIndexArray from "./ShowInvertedIndexArray";
import {sortInvertedIndex} from "../functions/Utilities";

class ShowInvertedIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data : {}
        }
    }

    componentDidMount = async () => {
        let tmp = await sortInvertedIndex();
        this.setState({
            data:tmp
        })

    }

    render(){
        return(
            <div className={'justify-content-center text-center'}>

                {  Object.keys(this.state.data).length > 0 && this.state.data.map((word)=>
                <ShowInvertedIndexArray
                    key = {word}
                    word = {word}
                    array = {inverted_indexes[word]}
                />
                )
                }
            </div>
        )
    }
}

export default ShowInvertedIndex;