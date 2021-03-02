import "../styles.css";
import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LabelList
} from "recharts";

import {buildP10GraphData, mapAverageP10} from '../functions/ProduceQueryData';
import {exportToCsv} from '../functions/ConvertDataToExcel';

class ProduceSimpleScatterChart extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: [

            ],
            map10Score:0
        }
    }
    componentDidMount () {
        let tmp = buildP10GraphData();
        this.setState({
            data:tmp
        })
        alert('press show 100 queries again if nothing show');
    }

    getMapAvg10 = async ()=> {
        let tmp2 = await mapAverageP10();
        this.setState({
            map10Score :tmp2
        })
    }



    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.data.length!=prevState.data.length){
            alert('refresh page by pressing show queries result again');
        }
    }

    downloadPRData = () =>{
        exportToCsv(this.state.data);
    }

    render(){
        return(
            <div className={"container-fluid"}>
                <br/>
                <button
                    className={'btn btn-warning'}
                    onClick={()=>this.getMapAvg10()}> get Mean Average P@10 for all queries</button>
                <h2>Precision@10 Graphs for 100 Queries</h2>
                <ScatterChart
                    width={1000}
                    height={400}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" label={{ value: "queryNum", position: "insideBottomRight"}}
                           dx={5}
                           dataKey="queryNum" name="queryNum"/>
                    <YAxis type="number" label={{ value: "precision", position: "insideTopLeft" }}
                           dy={5}
                           dataKey="precision" name="precision"/>
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="A school" data={this.state.data} fill="#8884d8"></Scatter>
                </ScatterChart>
                <br/>
                <h2>Recall@10 Graphs for 100 Queries</h2>
                <ScatterChart
                    width={1000}
                    height={400}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" label={{ value: "queryNum", position: "insideBottomRight"}}
                           dx={5}
                           dataKey="queryNum" name="queryNum"/>
                    <YAxis type="number" label={{ value: "recall", position: "insideTopLeft" }}
                           dy={5}
                           dataKey="recall" name="recall"/>
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="A school" data={this.state.data} fill="#8884d8"></Scatter>
                </ScatterChart>

                <br/>
                <button
                    className={'btn btn-success'}
                    onClick={()=>this.downloadPRData()}> See all Precision and Recall Data @10 in excel file</button>
                <br/>
                <br/>
            </div>

        )
    }
}
export default ProduceSimpleScatterChart;