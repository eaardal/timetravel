import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TimetravelButton from './TimetravelButton';
import { loadDebugSessions } from './timetravel.actions';
import guid from '../../utils/guid.util';
import timetravelDispatcher from './timetravelDispatcher';

const TimetravelContainer = ({ debugSessions, onLoadDebugSessions }) => (
  <div>
    <h1>Timetravel</h1>
    <button onClick={onLoadDebugSessions}>Load sessions</button>
    {debugSessions.map(session =>
      session.actions.map(action =>
        (<h3>action.type</h3>)
      )
    )}
  </div>
);

TimetravelContainer.propTypes = {
  debugSessions: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  debugSessions: state.timetravel.debugSessions,
});

const mapDispatchToProps = (dispatch) => ({
  onLoadDebugSessions: () => dispatch(loadDebugSessions()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimetravelContainer);
