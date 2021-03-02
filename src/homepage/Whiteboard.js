import React from 'react';

import Homepage from './Homepage';

class Whiteboard extends React.Component {
    render(){
        return(
            <div className={'justify-content-center text-center'}>
                <br/>
                <h1> Tokenization x Indexing x Ranking </h1>
                <Homepage />
            </div>
        )
    }
}

export default Whiteboard;