import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import timetravelReducer from 'features/timetravel/timetravel.reducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  timetravel: timetravelReducer,
});

export default rootReducer;
