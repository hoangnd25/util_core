import { FeatureToggleModel } from "@go1d/go1d-exchange";

export interface GO1Portal {
    id: string;
    title: string;
    configuration: any;
    data: any;
    featureToggles: FeatureToggleModel[];
    files: {
        // eslint-disable-next-line
        dashboard_icon?: string;
    };
}

export interface GO1Account {
    id: number;
    uuid: string;
    roles?: string[];
    instance?: GO1Portal;
}

export interface GO1User {
    id: number;
    uuid: string;
    roles?: string[];
    accounts?: GO1Account[];
    jwt: string;
    /*eslint-disable */
    first_name?: string;
    last_name?: string;
    /* eslint-enable */
    avatar?: {
        url: string;
    };
    locale?: string[];
}

export interface CurrentSessionType {
    user?: GO1User;
    account?: GO1Account;
    portal?: GO1Portal;
    jwt?: string;
    authenticated: boolean;
}
