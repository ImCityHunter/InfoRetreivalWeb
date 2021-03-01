

import React from 'react';
import ProduceSimpleScatterChart from './ProduceSimpleScatterChart';
import ProduceLineChart from './ProduceLineChart';

import {calculateInterpolated} from '../functions/ProduceQueryData';

export class ShowGraphPage extends React.Component{

    componentDidMount = async ()=> {
        calculateInterpolated();
    }

    constructor(props) {
        super(props);
        this.state = {
            show:false
        }

    }
    show =() =>{
        this.setState({
            show:!this.state.show
        })
    }
    render(){
        return(
            <div>
                <ProduceSimpleScatterChart/>
                <br/>
                <button onClick={()=>this.show()}>Show Average 11-point Precision and Recall Graph</button>
                <br/>
                {
                    this.state.show && <ProduceLineChart/>
                }
            </div>
        )
    }
}

export default ShowGraphPage;