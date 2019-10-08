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
