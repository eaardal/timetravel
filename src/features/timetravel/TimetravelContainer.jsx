import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TimetravelButton from './TimetravelButton';
import { loadDebugSessions, debugSession } from './timetravel.actions';
import guid from '../../utils/guid.util';
import timetravelDispatcher from './timetravelDispatcher';
import forOwn from 'lodash/forOwn';
import {
  Navbar, Nav, NavItem, Col, Row, Button, ListGroup, ListGroupItem, Panel, Accordion
} from 'react-bootstrap';

const TimetravelContainer = ({
  debugSessions,
  onLoadDebugSessions,
  onDebugSession,
}) => (
  <div>
    <h1>Recorded sessions</h1>
    <Button bsStyle="primary" onClick={onLoadDebugSessions}>Load sessions</Button>
    <br /><br />
    {debugSessions.map(session =>
      (<div key={`div-${session.id}`}>
        <Panel bsStyle="info" header={`Session ${session.id} | Started at ${session.startTimestamp} by ${session.user}`}>
          <ListGroup fill>
            {session.actions.map(action =>
              <ListGroupItem key={action.id}>
                <h4>{action.type}</h4>
                <pre>{action.json}</pre>
                <Button bsStyle="success" bsSize="small" onClick={() => onDebugSession(session, action)}>Playback to this point</Button>
              </ListGroupItem>
            )}
          </ListGroup>
        </Panel>

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
