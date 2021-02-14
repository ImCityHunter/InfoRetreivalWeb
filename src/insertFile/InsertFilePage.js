import React from 'react';

import readStopList from '../functions/ReadStopList';
import {parseXML, getRunTime} from '../functions/ReadXML'
import {inverted_indexes, stopList} from '../variables/variables';
import ShowInvertedIndex from "../showInvertedIndexes/ShowInvertedIndex";
class InsertFilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sorted:[],
            runTime:0,
            xmlFile: "",
            show: 3
        }
    }

    componentDidMount = async () => {
        await readStopList.readStopList();
    }
    insertFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target.result)
            this.setState({
                xmlFile:text
            })
        };
        reader.readAsText(e.target.files[0])
    }

    submit = async (e) => {
        const sorted =  await parseXML(this.state.xmlFile)
        const time = await getRunTime();
        this.setState({
            sorted:sorted,
            runTime:time
        })
    }

    render(){
        return(
            <div>
                <div className={'justify-content-center text-center'}>
                    <form>
                        <input type="file" onChange={(e) => this.insertFile(e)} />
                        <button type="button" onClick={() => this.submit()}>submit</button>
                    </form>
                </div>
                <div className={'row justify-content-center'}>
                        RunTime is {this.state.runTime} seconds
                </div>
                <br/>
                {
                    this.state.sorted && this.state.sorted.map(word=>
                        <ShowInvertedIndex
                        key={word.toString()}
                        word={word}
                        array={inverted_indexes[word]}/>)
                }
            </div>
        )
    }
}

export default InsertFilePage;