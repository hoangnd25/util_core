import { getStorage } from '../utils/storage';

// ActionTypes
export const USER_UPDATE = 'currentAccount/USER_UPDATE';
const USER_LOGOUT = 'currentAccount/USER_LOGOUT';

interface RuntimeAction {
    type: 'currentAccount/USER_UPDATE' | 'currentAccount/USER_LOGOUT';
    payload: any;
}

// Reducers
export function accountReducer(state = {}, action: RuntimeAction) {
  switch (action.type) {
  case USER_UPDATE: {
    return { status: 'LOGGED_IN', ...action.payload };
  }

  case USER_LOGOUT: {
    return { status: 'LOGGED_OUT' };
  }

  default: {
    return state;
  }
  }
}
