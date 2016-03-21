import * as React from 'react';
import {getPlacesByGeoFrame, GeoFrame} from '../queries';
declare var google: any;
import {Loader} from '../components/loader';
export class PlacesInFrame extends React.Component<{}, { isInProgress: boolean; }> {
    state = { isInProgress: false }
    private frame: GeoFrame = {
        minLatitude: 38.885922015773524,
        maxLatitude: 38.897708018277825,
        minLongetude: -77.04574584960938,
        maxLongitude: -77.02173709869385
    };
    private markers = [];
    private map: any;
    componentDidMount() {
        this.map = new (window as any).google.maps.Map(document.getElementById('gmap'), {
            center: { lat: (this.frame.maxLatitude + this.frame.minLatitude) / 2, lng: (this.frame.maxLongitude + this.frame.minLongetude) / 2 },
            zoom: 13
        });
        let rectangle = new google.maps.Rectangle({
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(this.frame.minLatitude, this.frame.minLongetude),
                new google.maps.LatLng(this.frame.maxLatitude, this.frame.maxLongitude)
            ),
            editable: true,
            draggable: true
        });
        /**
        * Click to map should set center of rectangle to point where clicked
        */
        this.map.addListener('click', (e) => {
            const centerLat = e.latLng.lat();
            const centerLng = e.latLng.lng();
            const latDiff = (this.frame.maxLatitude - this.frame.minLatitude) / 2;
            const lngDiff = (this.frame.maxLongitude - this.frame.minLongetude) / 2;
            const newMaxLatitude = centerLat + latDiff;
            const newMaxLongetude = centerLng + lngDiff;
            const newMinLatitude = centerLat - latDiff;
            const newMinLongetude = centerLng - lngDiff;
            rectangle.setBounds(new google.maps.LatLngBounds(
                new google.maps.LatLng(newMinLatitude, newMinLongetude),
                new google.maps.LatLng(newMaxLatitude, newMaxLongetude)
            ));
            this.frame = {
                maxLatitude: newMaxLatitude,
                minLatitude: newMinLatitude,
                maxLongitude: newMaxLongetude,
                minLongetude: newMinLongetude
            };
        });
        rectangle.addListener('bounds_changed', () => {
            let bounds = rectangle.getBounds();
            this.frame = {
                maxLatitude: bounds.getNorthEast().lat(),
                minLatitude: bounds.getSouthWest().lat(),
                maxLongitude: bounds.getNorthEast().lng(),
                minLongetude: bounds.getSouthWest().lng()
            };
        });

        rectangle.setMap(this.map);
        this.search();
    }
    clearMarkers() {
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });
        this.markers = [];
    }
    search() {
        this.setState({ isInProgress: true }, () =>
            getPlacesByGeoFrame(this.frame, 40, (places) => {
                this.setState({ isInProgress: false });
                this.clearMarkers();
                for (let place of places) {
                    const coords = [parseFloat(place.lat.value), parseFloat(place.long.value)];
                    const infowindow = new google.maps.InfoWindow;
                    infowindow.setContent(
                        `<span>
                        <a href="${place.item.value}"> ${place.name.value} </a>
                    </span>`
                    );
                    let marker = new google.maps.Marker({
                        position: { lat: coords[0], lng: coords[1] },
                        map: this.map,
                        title: 'Hello World!'
                    });
                    marker.addListener('click', function() {
                        infowindow.open(this.map, marker);
                    });
                    this.markers.push(marker);
                }
            }));

    }
    render() {
        return (
            <div>
                <h3>Museums in frame</h3>
                <button onClick={() => this.search() }>Search</button>
                {this.state.isInProgress ?
                    <Loader/> : false
                }
                <div id="gmap" style={{ width: '600px', height: '400px' }}></div>
            </div>
        );
    }
}
