import { createContext } from 'react';

interface AppContextType {
    store: {
        subscribe: Function;
        dispatch: Function;
        getState: Function;
    };
    cookies: any;
    http: any;
}

const AppContext = createContext<AppContextType>({
  store: {
    subscribe: null,
    dispatch: null,
    getState: null,
  },
  cookies: null,
  http: null,
});
export default AppContext;
