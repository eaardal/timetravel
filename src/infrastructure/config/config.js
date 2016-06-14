import configurations from './config.yml';
import { replaceLocalhost } from 'utils/config.util';

const config = configurations[process.env.ENVIRONMENT];
let configCopy = config;
// If we are on local machine we want to use the machine name as host instead of localhost
if (process.env.ENVIRONMENT === 'localhost') {
  configCopy = replaceLocalhost(config);
}

// window.config = configCopy;

export default configCopy;
