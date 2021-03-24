import { createContext } from 'react';
import { HttpInstance } from './http';

interface AppContextType {
    cookies: any;
    http: HttpInstance;
}

const AppContext = createContext<AppContextType>({
  cookies: null,
  http: null,
});
export default AppContext;
