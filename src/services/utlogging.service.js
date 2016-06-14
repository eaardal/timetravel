import config from 'infrastructure/config/config';

const signOut = () => {
  window.location = `${config.apiEndpoints.logout}`;
};

export {
  signOut,
};
