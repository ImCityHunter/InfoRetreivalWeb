import React from "react";
import { LineChart, Line, YAxis, XAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { calculateInterpolated } from "../functions/ProduceQueryData";

class ProduceLineChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [

            ]
        }
    }
    componentDidMount () {
        let tmp = calculateInterpolated();
        this.setState({
            data:tmp
        })
        console.log('interpolate result :',tmp);
        alert('check console log for details');
    }

    render() {
        return (
            <div className={"container-fluid"}>
                <br/>
                <h2> AVG interpolate Graphs</h2>
                <br/>
                <LineChart width={730} height={250} data={this.state.data}
                           margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="recall" label={{ value: "recall", position: "insideBottomRight"}}/>
                    <YAxis label={{ value: "precision", position: "insideTopLeft"}}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="interpolate" stroke="#0095FF" />
                </LineChart>
            </div>
        )
    };
}

export default ProduceLineChart;
