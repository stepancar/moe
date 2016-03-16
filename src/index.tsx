import * as React from 'react';
import {render} from 'react-dom';
import {sparqlQueryJson} from './sparqlJson';

const endpoint = 'http://dbpedia.org/sparql';
const query = "SELECT * WHERE {?uri geo:lat ?lat .?uri geo:long ?lon .?uri rdf:type ?thetype .FILTER ( (?lat> 40.0  && ?lat < 41.15) &&(?lon> -3  && ?lon < 4)&& regex(?thetype,'^http://schema.org'))}";
sparqlQueryJson(endpoint, query, (data) => {
    console.log(data);
});
class Root extends React.Component<{}, {}> {

    render() {
        return (
            <div></div>
        );
    }
}
render(<Root />, document.getElementById('root'));
