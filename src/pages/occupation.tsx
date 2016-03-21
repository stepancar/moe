import * as React from 'react';
import {sparqlQueryJson} from '../sparqlJson';
import {birthPlaceForOccupation} from '../queries';
const endpoint = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';
declare var google: any;

let myMap;
export class Occupation extends React.Component<{}, { occupation: string, limit: number, countries: Array<any> }> {
    state = { occupation: 'scientist', limit: 20, countries: [] };
    componentDidMount() {
        (window as any).ymaps.ready(() => {
            myMap = new (window as any).ymaps.Map('map', {
                center: [40, 0],
                zoom: 1
            });
            //this.search();
        });

    }
    search() {

        const query = birthPlaceForOccupation(this.state.occupation, this.state.limit);

        sparqlQueryJson(endpoint, query, (data) => {
            myMap.geoObjects.removeAll();
            console.log(data);
            for (let hum of JSON.parse(data).results.bindings) {

                const coords = [parseFloat(hum.lat.value), parseFloat(hum.long.value)];
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
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return (
            <div>
                <h3>Write occupation</h3>
                <input value={this.state.limit} type="number" onChange={(e) => this.onLimitInputChangeHandler((e.target as any).value) } />
                <input value={this.state.occupation} onChange={(e) => this.onInputChangeHandler((e.target as any).value) } />
                <button onClick={() => this.search() }> Search</button>
                <select>
                    {this.state.countries.map((country) =>
                        <option></option>
                    ) }
                </select>
                <div id="map" style={{ width: '600px', height: '400px' }}></div>
            </div>
        );
    }
}
