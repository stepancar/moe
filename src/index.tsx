import * as React from 'react';
import {render} from 'react-dom';
import {Occupation} from './pages/occupation';
import {PlacesInFrame} from './pages/placesInFrame';




class Root extends React.Component<{}, {}> {
    render() {
        return (
            <div>
                <Occupation />
                <PlacesInFrame />
            </div>
        );
    }
}
render(<Root />, document.getElementById('root'));
