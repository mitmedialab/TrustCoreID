import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Anon from '../components/Anon';

function mapStateToProps(state) {
    return state;
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Anon);
