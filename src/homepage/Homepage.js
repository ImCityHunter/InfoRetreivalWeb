import React from 'react';
import {readStopList} from "../functions/ReadStopList";
import {readAllXmlFiles} from "../functions/ReadCFCXML";
import {buildWordIDF} from "../functions/Ranking";
import {readQueryXMLFile} from '../functions/ReadQueryXML';
import ShowGraphPage from "../graphPage/ShowGraphPage";
import UserInsertPage from "../userInsertQuery/UserInsertPage";
import ShowInvertedIndex from "../invertedIndexPage/ShowInvertedIndex";
class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: "SEARCH"
        }
    }
    componentDidMount =  async () => {
        await readStopList();
        await readAllXmlFiles();
        await buildWordIDF();
        await readQueryXMLFile();
    }

    showGraph = () => {
        this.setState({
            show:"GRAPH"
        })
    }

    showUserInput = () =>{
        this.setState({
            show:"SEARCH"
        })
    }

    showIndex = ()=>{
        this.setState({
            show:"INDEX"
        })
    }
    openLink = () =>{
        window.open('https://github.com/ImCityHunter/InfoRetreivalWeb', '_blank');
    }

    render(){
        return(
            <div>
                <label>
                    <button className={'mr-2'}
                        onClick={()=>this.showGraph()}>Show 100 queries result</button>
                    <button className={'mr-2'}
                        onClick={()=>this.showIndex()}>Show Inverted Index </button>
                    <button className={'mr-2'}
                        onClick={()=>this.showUserInput()}> Insert Customized query </button>
                    <button
                        onClick={()=>this.openLink()}>Read Design</button>
                </label>

                {
                    this.state.show=="GRAPH" && <ShowGraphPage/>
                }

                {
                    this.state.show=="SEARCH" && <UserInsertPage/>
                }
                {
                    this.state.show=="INDEX" && <ShowInvertedIndex/>
                }
            </div>
        )
    }
}

export default Homepage;