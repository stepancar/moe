import * as React from 'react';
import {render} from 'react-dom';
import {sparqlQueryJson} from './sparqlJson';
import {birthPlaceForOccupation} from './queries';
const endpoint = 'http://query.wikidata.org/bigdata/namespace/wdq/sparql';


class Root extends React.Component<{}, { occupation: string }> {
    state = { occupation: 'programmer' };
    search() {
        const query = birthPlaceForOccupation(this.state.occupation);
        sparqlQueryJson(endpoint, query, (data) => {
            console.log(data);
        });
    }
    onInputChangeHandler(newVal: string) {
        this.setState({
            occupation: newVal
        });
    }
    render() {
        return (
            <div>
                <input value={this.state.occupation} onChange={(e) => this.onInputChangeHandler((e.target as any).value) } />
                <button onClick={() => this.search() }/>
            </div>
        );
    }
}
render(<Root />, document.getElementById('root'));
