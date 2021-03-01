import React from 'react';
import ShowRankingPageContainer from "./ShowRankingPageContainer";
import {readQueryXMLFile} from "../functions/ReadQueryXML";




class UserInsertPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            queryText:"",
            result: false,
            top: 20,
        }
    }

    componentDidMount = async () => {

    }


    submit = () => {
        this.setState({
            result:true
        })
    }

    delete = ()=>{
        this.setState({
            result:false,
            queryText:""
        })
    }


    render(){
        return(
            <div>
                {
                    !this.state.result &&
                    <form>
                        <div className={'form-group row'}>
                            <label className={'col-form-label col-sm-2'}> Top X Selection </label>
                            <select className={'col-sm-10'} defaultValue={'20'}
                                    onChange={(e)=>{
                                        let tmp = e.target.value;
                                        this.setState({
                                            top:tmp
                                        })
                                    }}
                            >
                                <option value='20'>20</option>
                                <option value='10'>10</option>
                                <option value='5'>5</option>
                                <option value='1'>1</option>
                            </select>
                        </div>
                        <div className={'form-group row'}>
                            <label className={'col-sm-2 col-form-label'}>QueryText</label>
                            <input
                                className={'form-control col-sm-10'}
                                placeholder = "query text"
                                onChange={(e)=>{
                                    let temp = e.target.value;
                                    this.setState({
                                        queryText:temp
                                    })
                                }} />
                        </div>

                    </form>

                }
                <br/>
                <br/>

                {
                    !this.state.result && <button onClick={()=>this.submit()}>Search</button>
                }
                {
                    this.state.result && <button onClick={()=>this.delete()}>Clean</button>
                }
                {
                    this.state.result && <ShowRankingPageContainer
                        queryText = {this.state.queryText}
                        top = {this.state.top}
                    />
                }
            </div>
        )
    }
}

export default UserInsertPage;