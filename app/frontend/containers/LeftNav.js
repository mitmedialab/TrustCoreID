import LeftNav from '../components/LeftNav';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

function mapStateToProps(state) {

    return {
        list: state.items.list.reduce((memo, item) => {
            let index = (item.atr.signatures && item.atr.signatures.length > 0) ? 3 : 0;
            memo[index].push(item);
            return memo;
        }, {0: [], 1: [], 2: [], 3: [], 4: []}),
        router: state.router
    };
}

function mapDispatchToProps(dispatch) {
    return {}; //bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
