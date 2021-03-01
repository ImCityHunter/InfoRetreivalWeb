import React from 'react';
import {getTopResult} from '../functions/Ranking';
import {convertArray} from '../functions/Utilities';
import ShowRankingArray from './ShowRankingArray';

class ShowRankingPageContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result : {}
        }
    }

    componentDidMount = async () => {
        let queryText = this.props.queryText
        let top = this.props.top
        //let queryText = "What are the effects of calcium on the physical properties of mucus from CF patients?"
        const tmp = await getTopResult(queryText, top);
        const tmp2 = await convertArray(tmp);
        this.setState({
            result:tmp2
        })
        if(tmp2.length==0){
            alert('result is none');
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(Object.keys(this.state.result).length!==Object.keys(prevState.result).length){
            alert('updated')
        }
    }

    render(){
        return(
            <div className={'justify-content-center text-center'}>
                <br/>
                <h2> Result </h2>
                {  Object.keys(this.state.result).length > 0 &&
                        <ShowRankingArray array = {this.state.result} />}
            </div>
        )
    }
}

export default ShowRankingPageContainer;