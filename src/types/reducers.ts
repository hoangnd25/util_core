import { CurrentSessionType } from "./user";

export interface RuntimeSettings {
    embeddedMode: boolean
}

export interface ReduxState {
    runtime: RuntimeSettings;
    currentSession: CurrentSessionType;
}
