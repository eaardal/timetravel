import React from 'react';

import { signOut } from 'services/utlogging.service';
import i18n from 'i18n/i18nCache';

const signout = (e) => {
  e.preventDefault();
  /* getSignoutUrl()
    .then(signOut); */
  signOut();
};

const SignoutLink = () =>
  <a href="#" onClick={signout}>
    { i18n.translate(i => i.SIGN_OUT) }
  </a>;

export default SignoutLink;
