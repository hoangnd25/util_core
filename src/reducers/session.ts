// ActionTypes
export const USER_UPDATE = 'currentSession/USER_UPDATE';
const USER_LOGOUT = 'currentSession/USER_LOGOUT';

interface sessionAction {
    type: 'currentSession/USER_UPDATE' | 'currentSession/USER_LOGOUT';
    payload: any;
}

export const sessionDefaultState = null;

// Reducers
export function sessionReducer(state = sessionDefaultState, action: sessionAction) {
  switch (action.type) {
    case USER_UPDATE: {
      return { authenticated: true, ...action.payload };
    }

    case USER_LOGOUT: {
      return { authenticated: false };
    }

    default: {
      return state;
    }
  }
}
