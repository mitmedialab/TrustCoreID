import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Anon from '../components/anon/Anon';
import * as AnonPageActions from '../actions/anon';

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(AnonPageActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Anon);
