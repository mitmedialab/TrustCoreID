/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';

import ListPage from './containers/ListPage';
import AnonPage from './containers/AnonPage';
import NewDocumentPage from './containers/NewDocumentPage';
import ActivityFeedPage from './containers/ActivityFeedPage';

import LeftNav from './containers/LeftNav'
import TopBar from './containers/TopBar'

class Wrapper extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (<span>
                <TopBar />
                <LeftNav />
                <Route path="/runtime/documents/:id" component={ListPage} />
                <Route path="/runtime/newdoc" exact={true} component={NewDocumentPage}/>
                <Route path="/runtime/activity" component={ActivityFeedPage}/>
            </span>)
    }

}

export default () => (
    <App>
        <Route path="/" exact={true} component={AnonPage}/>
        <Route path="/runtime" component={Wrapper} />
    </App>
);
