import List from '../components/list/List';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ListPageActions from '../actions/listPage';


function mapStateToProps(state) {
    return {
        list: state.items.list,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ListPageActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
