import config from '../config';
import UserService from '../services/UserService';
import { getStorage } from '../utils/storage';

// ActionTypes
const USER_UPDATE = 'currentAccount/USER_UPDATE';
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

// Actions
export function authenticate() {
  return async (dispatch: (...args: any) => void, getState, { http, cookies }) => {
    try {
      let user: object;
      let jwt: string;
      let uuid: string;
      let instanceName: string;

      const go1Cookie = cookies.get('go1');
      if (go1Cookie) {
        [uuid, instanceName, jwt] = go1Cookie.split(':');
      } else if (__DEV__ && config.localJWT) {
        // For local support .env JWT, will pick the first account returned by the server
        http.setJWT(config.localJWT);
        user = await UserService(http).getCurrentAccount();
        uuid = user.accounts[0].uuid;
        instanceName = user.accounts[0].instance_name;
        jwt = user.jwt;
      } else {
        // Fallback to localStorage if Cookie doesn't exist
        jwt = getStorage('jwt');
        uuid = getStorage('uuid');
        instanceName = getStorage('active-instance-domain');
      }

      http.setJWT(jwt);
      user = await UserService(http).getCurrentAccount({
        uuid,
        portal: instanceName,
      });

      if (!user) {
        throw new Error('Not an user');
      }

      // Temporarly Set the cookie here
      cookies.set('go1', [user.uuid, user.instance_name, user.jwt].join(':'));

      dispatch({
        type: USER_UPDATE,
        payload: { user },
      });

      return user;
    } catch (e) {
      dispatch({
        type: USER_LOGOUT,
      });
    }
  };
}
