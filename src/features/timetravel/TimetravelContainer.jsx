import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TimetravelButton from './TimetravelButton';
import { addToCart, checkout } from './timetravel.actions';
import guid from '../../utils/guid.util';
import dispatch from './timetravelDispatcher';

const TimetravelContainer = ({ sessions }) => (
  <div>
    <h1>Timetravel</h1>
    {sessions.map(session =>
      (<TimetravelButton
        onClick={}
        text={`Debug session ${session.id}`}
      />)
    )}

  </div>
);

TimetravelContainer.propTypes = {

};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = () => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimetravelContainer);
