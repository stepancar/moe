import * as React from 'react';
import {render} from 'react-dom';
import {sparqlQueryJson} from './sparqlJson';
import {birthPlaceForOccupation} from './queries';
const endpoint = 'http://query.wikidata.org/bigdata/namespace/wdq/sparql';

(window as any).ymaps.ready(init);
let myMap;

function init() {
    myMap = new (window as any).ymaps.Map('map', {
        center: [40, 0],
        zoom: 1
    });
}
class Root extends React.Component<{}, { occupation: string, limit: number }> {
    state = { occupation: 'scientist', limit: 20 };
    componentDidMount() {
        this.search();
    }
    search() {

        const query = birthPlaceForOccupation(this.state.occupation, this.state.limit);

        sparqlQueryJson(endpoint, query, (data) => {
            myMap.geoObjects.removeAll();
            console.log(data);
            for (let hum of JSON.parse(data).results.bindings) {

                const coords = hum.coord.value.replace('Point(', '').replace(')', '').split(' ').map((val) => parseFloat(val));
                const name = hum.label.value;
                const personLink = hum.subj.value;
                const photoSrc = hum.picture.value;
                const myPlacemark = new (window as any).ymaps.GeoObject({
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    },
                    properties: {
                        //iconContent: `<img style="width: 60px" src="${photoSrc}" />`,
                        balloonContent: (
                            `<span>
                                <a href="${personLink}" target="_blank">
                                    ${name}
                                    <img style="width: 60px" src="${photoSrc}" />
                                </a>
                            </span>`
                        )
                    }
                });
                myMap.geoObjects.add(myPlacemark);
            }
        });
    }
    onInputChangeHandler(newVal: string) {
        this.setState({
            occupation: newVal
        } as any);
    }
    onLimitInputChangeHandler(newLimit: number) {
        this.setState({ limit: newLimit } as any);
    }
    render() {
        return (
            <div>
                <h3>Write occupation</h3>
                <input value={this.state.limit} type="number" onChange={(e) => this.onLimitInputChangeHandler((e.target as any).value) } />
                <input value={this.state.occupation} onChange={(e) => this.onInputChangeHandler((e.target as any).value) } />
                <button onClick={() => this.search() }> Search</button>
            </div>
        );
    }
}
render(<Root />, document.getElementById('root'));
