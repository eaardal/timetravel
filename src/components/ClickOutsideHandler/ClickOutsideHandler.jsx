import React from 'react';
import { connect } from 'react-redux';
import { onClickOutside } from './clickOutsideHandler.actions';
import MobileDetect from 'mobile-detect';

const mobileDetect = new MobileDetect(window.navigator.userAgent);

const hasParentWithConatinerIdRecursive = (containerIds, node) => {
  if (containerIds.indexOf(node.id) > -1) {
    return true;
  } else if (node.parentElement) {
    return (hasParentWithConatinerIdRecursive(containerIds, node.parentElement));
  }
  return false;
};

const event = mobileDetect.is('iOS') ? 'touchstart' : 'click';

class ClickOutsideHandler extends React.Component {

  constructor(props) {
    super(props);
    const ids = this.props.containerIds
      ? this.props.containerIds
      : [this.props.containerId];
    this.onClick = this.dispatchEvent
      .bind(null, ids, this.props.onClickOutside);
  }

  dispatchEvent(containerIds, dispatch, ev) {
    if (!hasParentWithConatinerIdRecursive(containerIds, ev.target)) {
      dispatch(containerIds);
    }
  }

  render() {
    if (this.props.subscribe) {
      document.body.addEventListener(event, this.onClick);
    } else {
      document.body.removeEventListener(event, this.onClick);
    }
    return false;
  }
}

ClickOutsideHandler.propTypes = {
  onClickOutside: React.PropTypes.func.isRequired,
  subscribe: React.PropTypes.bool,
  containerId: React.PropTypes.string,
  containerIds: React.PropTypes.array,
};

const mapDispatchToProps = (dispatch) => ({
  onClickOutside: (containerId) => dispatch(onClickOutside(containerId)),
});

export default connect(null, mapDispatchToProps)(ClickOutsideHandler);
