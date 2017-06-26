import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ActivityFeed from '../components/feed/ActivityFeed';
import * as feedActions from '../actions/activityFeed';


function mapStateToProps(state) {
    return state.activity;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(feedActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityFeed);
