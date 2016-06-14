import fetch from '../../utils/http.util';

const sessionId = 1234;

let sessions = {};

const LogAction = {
  log: (action) => {
    console.log('Log action:', action);

    if (sessionId && !action.isDebug) {
      if (!sessions[sessionId]) {
        sessions[sessionId] = [];
      }
      sessions[sessionId].push(action);
    }
  },

  get: (sessionId) => {
    const actions = sessions[sessionId];
    console.log('Returning actions for session ' + sessionId, actions);
    return actions;
  },

  getAll: () => sessions,
};

export default LogAction;
