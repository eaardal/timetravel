import createActionCreator from 'utils/createActionCreator.util';
import timetravelDispatcher from './timetravelDispatcher';
import LogAction from './logAction';

export const ADD_TO_CART = 'ADD_TO_CART';
export const CHECKOUT = 'CHECKOUT';
export const RESET = 'RESET';
export const START_DEBUG_SESSION = 'START_DEBUG_SESSION';
export const STOP_DEBUG_SESSION = 'STOP_DEBUG_SESSION';
export const DEBUG_ACTION = 'DEBUG_ACTION';
export const LOAD_DEBUG_SESSIONS = 'LOAD_DEBUG_SESSIONS';
export const LOAD_DEBUG_SESSIONS_RECEIVE = 'LOAD_DEBUG_SESSIONS_RECEIVE';

export const addToCart = createActionCreator(ADD_TO_CART, 'newCartItem');
export const checkout = createActionCreator(CHECKOUT);

export const receiveLoadDebugSessions = createActionCreator(LOAD_DEBUG_SESSIONS_RECEIVE, 'debugSessions', 'isDebug');
export const reset = createActionCreator(RESET, 'isDebug');
export const startDebugSession = createActionCreator(START_DEBUG_SESSION, 'isDebug');
export const stopDebugSession = createActionCreator(STOP_DEBUG_SESSION, 'isDebug');
export const debugAction = createActionCreator(DEBUG_ACTION, 'action', 'isDebug');

export const loadDebugSessions = () => (dispatch) => {
  const sessions = LogAction.getAll();
  timetravelDispatcher(dispatch, receiveLoadDebugSessions(sessions, true));
};

export const debugSession = (session, untilAction) =>
  dispatch => new Promise((resolve, reject) => {
    console.log('Debugging session:', session);
    const isDebug = true;
    timetravelDispatcher(dispatch, reset(isDebug));
    timetravelDispatcher(dispatch, startDebugSession(isDebug));

    for (let i = 0; i < session.actions.length; i++) {
     const action = session.actions[i];

     setTimeout(() => {
       console.log(' > Dispatching debug action:', action);
       action.isDebug = true;
       timetravelDispatcher(dispatch, action);
     }, i * 500);

     if (untilAction && untilAction === action) {
       resolve();
       break;
     }
    }

    timetravelDispatcher(dispatch, stopDebugSession(isDebug));

    resolve();
});
