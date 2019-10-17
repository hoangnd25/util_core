import { createContext } from 'react';

interface AppContextType {
    cookies: any;
    http: any;
}

const AppContext = createContext<AppContextType>({
  cookies: null,
  http: null,
});
export default AppContext;
