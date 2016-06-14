import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import accountPickersReducer from 'components/AccountPicker/accountPicker.reducer';
import transferFormReducer from 'features/overfoere/overfoereForm.reducer';
import transferReducer from 'features/overfoere/overfoere.reducer';
import timetravelReducer from 'features/timetravel/timetravel.reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  transfer: transferReducer,
  accountPickers: accountPickersReducer,
  form: formReducer.plugin({
    transfer: transferFormReducer,
  }),
  timetravel: timetravelReducer,
});

export default rootReducer;
