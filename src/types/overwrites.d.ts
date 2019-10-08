//
// enviroment variables or custom keys in Native objects
//
declare interface Window {
    APP_STATE: TAppReduxState;
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
        shallow: typeof import('@types/enzyme').shallow;
        render: typeof import('@types/enzyme').render;
        mount: typeof import('@types/enzyme').mount;
        window: {
            location: {};
            matchMedia: jest.Mock<{
                addListener: (args: any) => args;
                matches: boolean;
                removeListener: (args: any) => args;
            }>;
        };
    }
}
