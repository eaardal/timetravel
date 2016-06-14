import fetch from '../../utils/http.util';
import LoginStore from './loginStore';

const LogAction = {
  log: (action) => {
    console.log('Action:', action);

    if (LoginStore.sessionId && !action.debug) {
      const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {},
      };
      const url = '';
      console.log('FETCH TIL: ' + url, options);
    }
  }
};

export default LogAction;
