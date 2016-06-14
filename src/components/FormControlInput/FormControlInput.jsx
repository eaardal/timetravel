import React, { PropTypes } from 'react';
import classNames from 'classNames';
import MobileDetect from 'mobile-detect';

const mobileDetect = new MobileDetect(window.navigator.userAgent);

const canShowErrorMessage = (field, displayError) => {
  if (!displayError) {
    return false;
  }

  const hasBeenActiveAndHasError = (field.dirty || field.touched) && field.error;
  return hasBeenActiveAndHasError;
};

const getNumberFieldsForDevice = () => {
  if (mobileDetect.is('iOS')) {
    return { type: 'text', pattern: '[0-9]*' };
  } else if (mobileDetect.is('AndroidOS')) {
    return { type: 'tel' };
  }
  return { type: 'tel', pattern: '[0-9\\s]*[0-9]*' };
};

const FormControlInput = (props) => {
  const {
    label,
    fields,
    active,
    maxLength,
    classes,
    type,
    id,
    placeholder,
    onKeyDown,
    displayError = true,
  } = props;
  let name = props.name || '';
  let inputcontrol;
  let typeFields = {};

  if (!type) {
    typeFields.type = 'text';
  } else if (type === 'number') {
    typeFields = getNumberFieldsForDevice();
  } else {
    typeFields.type = type;
  }

  const errorMessageElement = canShowErrorMessage(fields, displayError)
    ? <div className={'form-error form-error--active'} role={'alert'}>{ fields.error }</div>
    : null;

  const getInputcontrol = () => inputcontrol;

  const controlChildren = props.children
  ? React.cloneElement(props.children, { getInputcontrol })
  : null;

  return (
    <div className={classNames(
      'form-group',
      classes,
      {
        'form-group--active': active,
        'form-group--error': errorMessageElement,
      })}
      id={ `${id}-container` }
    >
    <div className="form-control-wrapper">
      <input
        ref={(input) => {inputcontrol = input;}}
        className={classNames(
          'form-control',
          {
            'form-control--active': active,
          })}
        name={ name }
        id={ id }
        placeholder={ placeholder }
        maxLength={ maxLength }
        onKeyDown={ onKeyDown }
        { ...typeFields }
        { ...fields }
      />
    <label htmlFor={ id }>{ label }</label>
    {controlChildren}
    </div>
    {errorMessageElement}
    </div>
      );
};

FormControlInput.propTypes = {
  classes: PropTypes.string,
  active: PropTypes.bool,
  name: PropTypes.string,
  children: PropTypes.object,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  fields: PropTypes.object.isRequired,
  maxLength: PropTypes.number,
  displayError: PropTypes.bool,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
};

export default FormControlInput;
