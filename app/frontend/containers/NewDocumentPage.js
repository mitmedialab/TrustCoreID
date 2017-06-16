import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NewDocumentComponent from '../components/documents/NewDocument';

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDocumentComponent);
