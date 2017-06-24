import LeftNav from '../components/LeftNav';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function mapStateToProps(state) {

    return {
        list: state.items.list,
        router: state.router
    };
}

function mapDispatchToProps(dispatch) {
    return {}; //bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
