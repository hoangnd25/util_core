import { ReduxState } from '@src/types/reducers';
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

declare namespace NodeJS {
  interface Global {
    navigator: {
      userAgent: string;
    };
  }
}

declare global {
  interface Window {
    APP_STATE: ReduxState;
    APP_CONFIG: { [key: string]: string };
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => any;
    beam: {
      identify?: Function;
      track?: Function;
    };
    FS: {
      event?: Function;
    };
    location: {
      assign: Function;
    };
  }
  // eslint-disable-next-line
  const __DEV__: boolean;
}
