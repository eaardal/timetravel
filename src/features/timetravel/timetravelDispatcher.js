import LogAction from './logAction';

const timetravelDispatcher = (dispatch, action) => {
  dispatch(action);
  LogAction.log(action);
};

export default timetravelDispatcher;
