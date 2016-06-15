import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TimetravelButton from './TimetravelButton';
import { loadDebugSessions, debugSession } from './timetravel.actions';
import guid from '../../utils/guid.util';
import timetravelDispatcher from './timetravelDispatcher';
import forOwn from 'lodash/forOwn';

const TimetravelContainer = ({
  debugSessions,
  onLoadDebugSessions,
  onDebugSession,
}) => (
  <div>
    <h1>Recorded sessions</h1>
    <button onClick={onLoadDebugSessions}>Load sessions</button>
    {debugSessions.map(session =>
      (<div key={`div-${session.id}`}>
          <h3 key={`h3-${session.id}`}>Session {session.id}</h3>
          <p key={`p-${session.id}`}>Started at {session.startTimestamp} by {session.user}</p>
          {session.actions.map(action =>
            <h5 key={action.id} style={ {marginLeft: '20px'} }>
              {action.type}
              <button onClick={() => onDebugSession(session, action)}>Playback to this point</button>
            </h5>
          )}
      </div>)
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
  onDebugSession: (session, untilAction) => dispatch(debugSession(session, untilAction)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimetravelContainer);
