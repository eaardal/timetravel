import {
  ONCLICK_OUTSIDE,
} from './clickOutsideHandler.constants';

import createActionCreator from 'utils/createActionCreator.util';

export const onClickOutside = createActionCreator(ONCLICK_OUTSIDE, 'containerIds');
