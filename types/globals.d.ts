interface IConfigureStoreHelpersConfig {
  history?: '' | History<any> | undefined;
  cookie?: {};
}

declare module 'universal-cookie-express' {
  declare global {
    declare namespace Express {
      export interface Request {
        universalCookies: import('react-cookie').Cookies;
        abEnvironmentToken?: {
          features: any;
        };
      }
    }
  }
  function cookiesMiddleware(): any;
  export default cookiesMiddleware;
}

declare module 'express-static-gzip' {
  const content: any;

  export default content;
}

declare module 'react-deep-force-update' {
  function deepForceUpdate(Component: any): void;
  export default deepForceUpdate;
}

declare module 'common-utils' {
  declare class Utils {
    deepClone(options: {}): void;
  }
  export default Utils;
}

//
// enviroment variables or custom keys in Native objects
//
declare const __DEV__: boolean;

declare interface Window {
  APP_STATE: ReduxState;
  APP_CONFIG: { [key: string]: string };
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => any;
}

declare interface NodeModule {
  hot: {
    accept: (param: string, cb: () => void) => any;
  };
}

declare module NodeJS {
  interface Global {
    navigator: {
      userAgent: string;
    };
  }
}
