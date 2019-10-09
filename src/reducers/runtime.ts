// ActionTypes
const SET_VARIABLE = 'runtime/SET_VARIABLE';

export const runtimeDefaultState = {};

interface RuntimeAction {
    type: 'runtime/SET_VARIABLE';
    payload: Payload;
}

interface Payload {
    name: string;
    value: any;
}

// Reducers
export function runtimeReducer(state = runtimeDefaultState, action: RuntimeAction) {
  switch (action.type) {
  case SET_VARIABLE: {
    return {
      ...state,
      [action.payload.name]: action.payload.value,
    };
  }

  default: {
    return state;
  }
  }
}

// Actions
export function setRuntimeVariable({ name, value }: Payload) {
  return {
    type: SET_VARIABLE,
    payload: {
      name,
      value,
    },
  };
}
