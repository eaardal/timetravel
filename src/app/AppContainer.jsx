import React from 'react';
import './styles/main.scss';

const App = (props) =>
  <div>
    {props.children}
  </div>;

App.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default App;
