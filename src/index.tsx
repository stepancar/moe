import * as React from 'react';
import {render} from 'react-dom';
import {sparqlQueryJson} from './sparqlJson';
import {birthPlaceForOccupation, getPlacesByGeoFrame} from './queries';

const endpoint = 'http://query.wikidata.org/bigdata/namespace/wdq/sparql';
declare var google: any;
(window as any).ymaps.ready(init);
let myMap;
let map;
let rectangle;
let frame;
let markers = [];
(window as any).initMap = function() {
    map = new (window as any).google.maps.Map(document.getElementById('gmap'), {
        center: { lat: 40, lng: 0 },
        zoom: 1
    });


    rectangle = new google.maps.Rectangle({
        bounds: new google.maps.LatLngBounds(
            new google.maps.LatLng(0, 0),
            new google.maps.LatLng(70, 30)
        ),
        editable: true,
        draggable: true
    });
    rectangle.addListener('bounds_changed', () => {
        let bounds = rectangle.getBounds();
        frame = {
            maxLatitude: bounds.getNorthEast().lat(),
            minLatitude: bounds.getSouthWest().lat(),
            maxLongitude: bounds.getNorthEast().lng(),
            minLongetude: bounds.getSouthWest().lng()
        }
        console.log(frame);
    })

    rectangle.setMap(map);
};
function init() {
    myMap = new (window as any).ymaps.Map('map', {
        center: [40, 0],
        zoom: 1
    });
}
class Root extends React.Component<{}, { occupation: string, limit: number, countries: Array<any> }> {
    state = { occupation: 'scientist', limit: 20, countries: [] };
    componentDidMount() {
        this.search();
    }
    search() {

        const query = birthPlaceForOccupation(this.state.occupation, this.state.limit);
        const queryForPlaces = getPlacesByGeoFrame(frame, 400);
        sparqlQueryJson(endpoint, queryForPlaces, (data) => {
            console.log(JSON.parse(data).results.bindings);
            markers.forEach((marker) => {
                marker.setMap(null);
            })
            markers = [];
            for (let hum of JSON.parse(data).results.bindings) {

                const coords = [parseFloat(hum.lat.value), parseFloat(hum.long.value)];
                const name = hum.label.value;
                const personLink = hum.subj.value;
                const photoSrc = hum.picture.value;
                let marker = new google.maps.Marker({
                    position: { lat: coords[0], lng: coords[1] },
                    map: map,
                    title: 'Hello World!'
                });
                markers.push(marker);
            }
        });
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
            </div>
        );
    }
}
render(<Root />, document.getElementById('root'));
