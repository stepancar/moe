import * as React from 'react';
import {render} from 'react-dom';
import {sparqlQueryJson} from './sparqlJson';
import {birthPlaceForOccupation} from './queries';
const endpoint = 'http://query.wikidata.org/bigdata/namespace/wdq/sparql';

(window as any).ymaps.ready(init);
var myMap;

function init() {
    myMap = new (window as any).ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 3
    });
}
class Root extends React.Component<{}, { occupation: string }> {
    state = { occupation: 'programmer' };
    search() {
        const query = birthPlaceForOccupation(this.state.occupation);
        sparqlQueryJson(endpoint, query, (data) => {
            console.log(data);
            for (let hum of JSON.parse(data).results.bindings) {

                const coords = hum.coord.value.replace('Point(', '').replace(')', '').split(' ').map((val) => parseFloat(val));
                const myPlacemark = new (window as any).ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: coords
                    }
                });
                myMap.geoObjects.add(myPlacemark);
            }
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
                <h3>Write occupation</h3>
                <input value={this.state.occupation} onChange={(e) => this.onInputChangeHandler((e.target as any).value) } />
                <button onClick={() => this.search() }> Search</button>
            </div>
        );
    }
}
render(<Root />, document.getElementById('root'));
