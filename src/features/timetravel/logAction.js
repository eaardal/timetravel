import fetch from '../../utils/http.util';
import guid from '../../utils/guid.util';
import moment from 'moment';

const getRandomIndex = (arr) => {
  const min = 0;
  const max = arr.length - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const people = ['bob', 'john', 'sarah', 'tim', 'anne', 'lucy'];
let sessionId = guid();
let user = people[getRandomIndex(people)];

let sessions = {};

const LogAction = {
  log: (action) => {
    if (action.isDebug) {
      return;
    }
    console.log('Log action:', action);

    if (sessions[sessionId] && sessions[sessionId].actions.length === 5) {
      sessionId = guid();
      user = people[getRandomIndex(people)];
    }

    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        actions: [],
        user,
        startTimestamp: moment().format('DD.MM.YYYY HH:mm'),
      };
    }
    action.id = guid();
    action.timestamp = moment().format('DD.MM.YYYY HH:mm');
    const json = JSON.stringify(action, null, 2);
    action.json = json;
    console.log(action);
    sessions[sessionId].actions.push(action);
  },
  getAll: () => {
    const s = [];

    for(let prop in sessions) {
      const sess = sessions[prop];
      const session = {
        id: prop.substring(0, 4),
        user: sess.user,
        startTimestamp: sess.startTimestamp,
        actions: sess.actions,
      };
      s.push(session);
    }

    return s;
  },
};

export default LogAction;
