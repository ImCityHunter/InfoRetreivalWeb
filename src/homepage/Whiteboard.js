import React from 'react';

import InsertFilePage from '../insertFile/insertFile';

class Whiteboard extends React.Component {
    render(){
        return(
            <div className={'justify-content-center text-center'}>
                <br/>
                <h1> Tokenizing and Indexing </h1>
                <InsertFilePage />
            </div>
        )
    }
}

export default Whiteboard;