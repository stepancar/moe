import * as React from 'react';
import {render} from 'react-dom';

class Root extends React.Component<{}, {}> {
    render() {
        return (
            <div>Hello</div>
        );
    }
}
render(<Root />, document.getElementById('root'));
