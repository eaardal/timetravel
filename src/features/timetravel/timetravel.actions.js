import createActionCreator from 'utils/createActionCreator.util';
import { timetravelDispatcher } from './timetravelDispatcher';
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

export const loadDebugSessions = () => {
  const sessions = LogAction.getAll();
  dispatch(receiveLoadDebugSessions(sessions, false));
};

export const debugSession = (session, untilAction) => {
  console.log('Debugging session:', session);
  const isDebug = true;
  dispatch(reset(isDebug));
  dispatch(startDebugSession(isDebug));

  for (let i = 0; i < session.actions.length; i++) {
   const action = session.actions[i];

   setTimeout(() => {
     console.log(' > Dispatching debug action:', action);
     dispatch(...action, isDebug);
   }, i * 250);

   if (untilAction && untilAction === action) {
     break;
   }
  }

  dispatch(stopDebugSession(isDebug));
};
