import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import classNames from 'classNames';
import DateTimeUtil from 'utils/dateTime.util';
import {
  amountClicked,
  postTransferForm,
  toggleFormCalendar,
  closeFormCalendar,
} from './overfoere.actions';
import TransferAccountsContainer from './KontoContainer';
import AmountIncreaser from 'components/AmountIncreaser/AmountIncreaser';
import AlertBox from 'components/AlertBox/AlertBox';
import i18n from 'i18n/i18nCache';
import keyCodes from 'common/keyCodes';
import FormControlInput from 'components/FormControlInput/FormControlInput';
import ResetButton from 'components/FormControlInput/ResetButton';
import IconButton from 'components/FormControlInput/IconButton';
import Datepicker from 'components/DatePicker/DatePicker';
import validateForm from './overfoere.validation';
import validateDate from 'components/DatePicker/datePicker.validation';
import combineValidators from 'common/validatorFactory';
import ClickOutsideHandler from 'components/ClickOutsideHandler/ClickOutsideHandler';

const today = DateTimeUtil.now();
const maxDate = DateTimeUtil.now().add(13, 'M');

const isKronerOrOereDirty = (kroner, oere) => (kroner.active || kroner.value !== '')
    || (oere.active || oere.value !== '');

const canShowErrorForAmount = (field, amountField) => {
  const isActiveAndDirtyAndHasError = field.active && field.dirty && amountField.error;
  const isDirtyAndHasError = field.dirty && amountField.error;
  const hasBeenTouchedAndHasError = field.touched && amountField.error;
  return isActiveAndDirtyAndHasError || hasBeenTouchedAndHasError || isDirtyAndHasError;
};

const TransferFormContainer = ({
  onAmountClicked,
  fields,
  error,
  onPostTransferForm,
  onToggleCalendar,
  handleSubmit,
  submitting,
  transferState,
  onCloseCalendar,
}) => {
  const amounts = [50, 100, 500, 1000];

  const fieldsDirty = isKronerOrOereDirty(fields.kroner, fields.oere);

  const showErrorForKroner = canShowErrorForAmount(fields.kroner, fields.amount);
  const showErrorForOere = canShowErrorForAmount(fields.oere, fields.amount);
  const showErrorForDueDate = (!fields.dueDate.active);

  const selectedDate = DateTimeUtil.parse(fields.dueDate.value, i18n.translate(i => i.DATE_FORMAT));
  const onDayClick = (day) => {
    const format = i18n.translate(i => i.DATE_FORMAT);
    const date = day.format(format).toString();
    fields.dueDate.onChange(date);
    onCloseCalendar();
  };

  const amountErrorMessageElement = (showErrorForKroner || showErrorForOere)
      ? <span>{ fields.amount.error }</span>
      : null;

  const globalError = error
      ? <div className="form-group">
          <AlertBox type="danger">{error}</AlertBox>
        </div>
      : null;

  const accountPickerFields = {
    fromAccount: fields.fromAccount,
    toAccount: fields.toAccount,
  };

  const onTabCalendar = (e) => {
    if (e.keyCode === keyCodes.TAB && e.shiftKey) {
      onCloseCalendar();
    }
  };

  const calendar = transferState.showCalendar
    ? (<Datepicker
      onSelectDate={ onDayClick }
      minDate={ today }
      maxDate={ maxDate }
      selectedDate={ selectedDate }
    />)
    : null;

  const onSubmitForm = handleSubmit(data => {
    const postData = {
      debitAccount: data.fromAccount.accountNumber,
      creditAccount: data.toAccount.accountNumber,
      amount: data.amount,
      dueDate: data.dueDate,
      note: data.message,
    };
    return onPostTransferForm(postData);
  });

  const onAmountClick = (amount) => {
    if (document.activeElement && document.activeElement.type !== 'button') {
      document.activeElement.blur();
    }
    onAmountClicked(amount);
  };

  return (
    <form className="transfer-form" onSubmit={ onSubmitForm }>
        <TransferAccountsContainer fields={accountPickerFields} />
        <FormControlInput
          classes="transfer-form__message form-group--end-padding--small"
          active={fields.message.active || fields.message.value !== ''}
          id="message"
          name="message"
          type="text"
          fields={fields.message}
          label={ i18n.translate(i => i.MELDING_INPUT_LABEL) }
        >
          <ResetButton fields={fields.message} />
        </FormControlInput>
      <div className="amount-container">
          <FormControlInput
            classes={classNames('transfer-form__kroner',
              { 'form-group--error': amountErrorMessageElement }) }
            active={fieldsDirty}
            id="kroner"
            name="kroner"
            type="number"
            fields={fields.kroner}
            label={ i18n.translate(i => i.KRONER_INPUT_LABEL) }
            maxLength={ 9 }
          />
          <FormControlInput
            classes={classNames('transfer-form__oere',
              { 'form-group--error': amountErrorMessageElement }) }
            active={fieldsDirty}
            id="oere"
            name="oere"
            type="number"
            fields={fields.oere}
            label={ i18n.translate(i => i.OERE_INPUT_LABEL) }
            maxLength={ 2 }
          />
          <div
            className={classNames('form-error',
              { 'form-error--active': amountErrorMessageElement })}
          >
            {amountErrorMessageElement}
          </div>
        </div>
        <FormControlInput
          classes={classNames('transfer-form__dueDate form-group--end-padding') }
          active={fieldsDirty}
          id="dueDate"
          name="dueDate"
          type="text"
          fields={fields.dueDate}
          label={ i18n.translate(i => i.FORFALLSDATO_INPUT_LABEL) }
          placeholder={ i18n.translate(i => i.DATE_DISPLAY_FORMAT) }
          onKeyDown={onTabCalendar}
          displayError={showErrorForDueDate}
        >
          <IconButton type="calendar" onClick={onToggleCalendar} />
        </FormControlInput>
        <ClickOutsideHandler subscribe={ !!calendar }
          containerIds={['DayPicker', 'dueDate-container']}
        />
        { calendar }
      <div className="form-group form-group__amount-increaser form-group--small">
        <AmountIncreaser
          onAmountClick={onAmountClick}
          amounts={amounts}
          classNames="transfer-form__amount-increaser"
        />
      </div>
      {globalError}
      <div className="form-group form-group__submit form-group--small">
        <button type="submit"
          disabled={ submitting }
          className={
            classNames('transfer-form__btn', { 'btn--loading': submitting })
          }
        >
        { i18n.translate(i => i.OVERFOERE_BUTTON) }
        </button>
      </div>
    </form>
  );
};

TransferFormContainer.propTypes = {
  fields: PropTypes.object.isRequired,
  // transferForm: PropTypes.object,
  error: PropTypes.string,
  onPostTransferForm: PropTypes.func.isRequired,
  onAmountClicked: PropTypes.func.isRequired,
  onToggleCalendar: PropTypes.func.isRequired,
  onCloseCalendar: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  transferState: PropTypes.object.isRequired,
};

const validate = combineValidators(
  validateForm(),
  validateDate('dueDate', DateTimeUtil.now(), DateTimeUtil.now().add(13, 'M'))
);

const form = reduxForm({
  form: 'transfer',
  fields: [
    'message',
    'kroner',
    'oere',
    'dueDate',
    'fromAccount',
    'toAccount',
    'amount',
  ],
  initialValues: {
    toAccount: undefined,
    message: '',
    kroner: '',
    oere: '',
    dueDate: DateTimeUtil.now().format(i18n.translate(i => i.DATE_FORMAT)).toString(),
    amount: 0.0,
  },
  touchOnBlur: false,
  validate,
});

const mapStateToProps = (state) => ({
  transferState: state.transfer,
});

const mapDispatchToProps = (dispatch) => ({
  onAmountClicked: (amount) => dispatch(amountClicked(amount)),
  onToggleCalendar: () => dispatch(toggleFormCalendar()),
  onCloseCalendar: () => dispatch(closeFormCalendar()),
  onPostTransferForm: (postData) => dispatch(postTransferForm(postData)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(form(TransferFormContainer));
