export interface GO1Portal {
    id: string;
    title: string;
    configuration: any;
    data: any;
    files: {
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
    first_name?: string;
    avatar?: {
        url: string;
    };
}

export interface CurrentSessionType {
    user: GO1User;
    account: GO1Account;
    portal: GO1Portal;
    jwt: string;
}
