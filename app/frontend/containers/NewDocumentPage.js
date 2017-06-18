import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NewDocumentComponent from '../components/documents/NewDocument';
import * as NewDocumentActions from '../actions/newDocument';

function mapStateToProps(state) {
    return state.newdoc
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(NewDocumentActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDocumentComponent);
