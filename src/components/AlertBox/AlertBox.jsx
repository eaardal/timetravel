import React, { PropTypes } from 'react';
import classNames from 'classNames';

const AlertBox = ({ type, title, large, children, className }) => (
  <div role="alert"
    className={
      classNames(
        `${className}`,
        'alert',
        {
          'alert--large': large,
          'alert--success': type === 'success',
          'alert--info': type === 'info',
          'alert--warning': type === 'warning',
          'alert--danger': type === 'danger',
        }
      )
    }
  >
    {large ? <i className={classNames(
      'alert__icon', 'icon',
      {
        'icon-check-circle': type === 'success',
        'icon-info-circle': type === 'info',
        'icon-exclamation-circle': type === 'warning',
        'icon-minus-circle': type === 'danger',
      })}
    >
    </ i> : null}
    {title ? <h3 className="alert__heading">{title}</h3> : null}
    {children}
  </div>
);

AlertBox.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  large: PropTypes.bool,
  children: React.PropTypes.node,
  className: React.PropTypes.string,
};

export default AlertBox;
