import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as NewDocumentActions from '../actions/newDocument';


function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NewDocumentActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
