import React from 'react';
import {readStopList} from "../functions/ReadStopList";
import {readAllXmlFiles} from "../functions/ReadCFCXML";
import {buildWordIDF} from "../functions/Ranking";
import {readQueryXMLFile} from '../functions/ReadQueryXML';
import ShowGraphPage from "../graphPage/ShowGraphPage";
import UserInsertPage from "../userInsertQuery/UserInsertPage";
class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true
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
            show:false
        })
    }

    showUserInput = () =>{
        this.setState({
            show:true
        })
    }

    render(){
        return(
            <div>
                <label>
                    <button onClick={()=>this.showGraph()}> Show 100 queries result </button>
                    <button onClick={()=>this.showUserInput()}> Insert Customized query </button>
                </label>

                {
                    !this.state.show && <ShowGraphPage/>
                }

                {
                    this.state.show && <UserInsertPage/>
                }

            </div>
        )
    }
}

export default Homepage;