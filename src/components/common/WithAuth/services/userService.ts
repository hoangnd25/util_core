import Cookies from 'universal-cookie';
import { FeatureToggleModel, FeatureToggleService } from "@go1d/go1d-exchange";
import { GO1Account, GO1Portal, GO1User, CurrentSessionType } from '@src/types/user';
import { getStorage, setStorage, removeStorage } from '@src/utils/storage';
import intersection from "@src/utils/intersection";
import { HttpInstance } from '@src/utils/http';

const AUTH_COOKIE_NAME = 'go1';

export function saveSession(currentSession: CurrentSessionType) {
  // only perform browser side
  if (typeof window !== 'undefined') {
    setStorage('jwt', currentSession.jwt, true);
    setStorage('uuid', currentSession.user.uuid, true);
    setStorage('active-instance', parseInt(currentSession.portal.id, 10), true);
    setStorage('active-instance-domain', currentSession.portal.title, true);
    const cookies = new Cookies();
    cookies.set(
      AUTH_COOKIE_NAME,
      [currentSession.user.uuid,  currentSession.portal.id, currentSession.portal.title, currentSession.jwt].join(
        ':'
      ), { path: '/' }
    );
  }
}

export function removeSession() {
  removeStorage('jwt');
  removeStorage('uuid');
  removeStorage('active-instance');
  removeStorage('active-instance-domain');
  const cookies = new Cookies();
  cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
}

/* istanbul ignore file  */
class UserService {
  public http: HttpInstance = null ;

  constructor(http: HttpInstance) {
    this.http = http;
    return this;
  }

  public async performAuth(go1CookieValue: string, oneTimeLoginToken: string) {
    let user: GO1User = null;
    // try one time login tokens
    if (oneTimeLoginToken) {
      user = await this.getCurrentAccountWithOTT(oneTimeLoginToken);
      // local developer mode
      // eslint-disable-next-line
    } else if (__DEV__ && process.env.LOCAL_JWT) {
      // For local support .env JWT, will pick the first account returned by the server
      this.http.setJWT(process.env.LOCAL_JWT);
      const params = {
        portal: "presprespres.dev.go1.cloud",
        uuid: "7fde8846-a2db-4c71-9b9d-db5cf9da5e16"
      }
      user = await this.getCurrentAccount(params);
    }

    if (user !== null) {
      return this.makeSession(user, '');
    }

    let jwt = '';
    let uuid: string;
    let instanceName = '';
    let instanceId: string;
    // try cookie
    if (go1CookieValue) {
      [uuid, instanceId, instanceName, jwt] = go1CookieValue.split(':');
    } else {
      // Fallback to localStorage if Cookie doesn't exist
      jwt = getStorage('jwt');
      uuid = getStorage('uuid');
      instanceName = getStorage('active-instance-domain');
    }
    // No login information found
    if (!jwt || !uuid) {
      return new Promise((resolve, reject) => reject(null));
    }

    this.http.setJWT(jwt);
    user = await this.getCurrentAccount({
      uuid,
      portal: instanceName,
    });
    return this.makeSession(user, instanceName);
  }

  public async getCurrentAccount(params?: { portal: string; uuid: string }): Promise<any> {
    const url = params
      ? `/user/account/current/${params.uuid}/${params.portal}?allPortals=false`
      : '/user/account/current';
    const resp = await this.http.get(url);
    return resp.data;
  }

  public async getCurrentAccountWithOTT(oneTimeLoginToken: string): Promise<any> {
    const url = `/user/account/password/${oneTimeLoginToken}?allPortals=false`;
    this.http.clearJWT();
    const resp = await this.http.get(url);
    return resp.data;
  }

  // move into go1d/exchange account model
  public getPermissions(account) {
    return account
      ? {
        isContentAdministrator: !!((account.roles && intersection(account.roles, ["content administrator"]).length > 0)),
        isAdministrator: !!((account.roles && intersection(account.roles, ["administrator", "Administrator"]).length > 0)),
        isManager: !!((account.roles && intersection(account.roles, ["manager", "Manager"]).length > 0)),
      }
      : {
        isContentAdministrator: false,
        isAdministrator: false,
        isManager: false,
      };
  }

  public async makeSession(rawUser: GO1User, instanceName: string) {
    const { accounts = [] as GO1Account[], jwt = '' as string, ...restUser } = rawUser;
    const currentAccount = Array.isArray(accounts)
      ? accounts.find(account => String(account.instance.title) === instanceName) || accounts[0]
      : undefined;
    if (!currentAccount) {
      throw new Error(`No account matched for ${instanceName}`);
    }
    const { instance = null, ...restAccount } = currentAccount;
    if (!instance) {
      throw new Error('No instance found in account');
    }

    let featureToggles = [];
    try {
      featureToggles = await FeatureToggleService(this.http).getFeatures({
        portal: instance.title,
      });
    } catch(err) {
      // do nothing
    }

    instance.featureToggles = featureToggles as FeatureToggleModel[];

    const permissions = this.getPermissions(restAccount);

    return {
      authenticated: true,
      user: restUser as GO1User,
      account: { ...restAccount, ...permissions } as GO1Account,
      portal: instance as GO1Portal,
      jwt,
    };
  }
}

export default function(http: HttpInstance) {
  return new UserService(http);
}
