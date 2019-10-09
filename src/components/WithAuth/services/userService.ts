import Cookies from 'universal-cookie';
import { GO1Account, GO1Portal, GO1User, CurrentSessionType } from '../../../types/user';
import { getStorage, setStorage } from '../../../utils/storage';
import intersection from "../../../utils/intersection";

export function saveSession(currentSession: CurrentSessionType) {
  // only perform browser side
  if (typeof window !== 'undefined') {
    setStorage('jwt', currentSession.jwt, true);
    setStorage('uuid', currentSession.user.uuid, true);
    setStorage('active-instance', parseInt(currentSession.portal.id, 10), true);
    setStorage('active-instance-domain', currentSession.portal.title, true);
    const cookies = new Cookies();
    cookies.set(
      'go1',
      [currentSession.user.uuid, currentSession.portal.title, currentSession.jwt, currentSession.portal.id].join(
        ':'
      )
    );
  }
}

/* istanbul ignore file  */
class UserService {
    public http = null;

    constructor(http) {
      this.http = http;
      return this;
    }

    public async performAuth(go1CookieValue: string, oneTimeLoginToken: string) {
      let user: GO1User = null;
      // try one time login tokens
      if (oneTimeLoginToken) {
        user = await this.getCurrentAccountWithOTT(oneTimeLoginToken);
        // local developer mode
      } else if (__DEV__ && process.env.LOCAL_JWT) {
        // For local support .env JWT, will pick the first account returned by the server
        this.http.setJWT(process.env.LOCAL_JWT);
        user = await this.getCurrentAccount();
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
        [uuid, instanceName, jwt, instanceId] = go1CookieValue.split(':');
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
      const resp = await this.http.get(url);
      return resp.data;
    }

  public getPermissions(account) {
    return account
      ? {
        isContentAdministrator: /content administrator/.test(account.roles),
        isAdministrator: !!((account.roles && intersection(account.roles, ["administrator", "Administrator"]).length > 0)),
        isManager: !!((account.roles && intersection(account.roles, ["manager", "Manager"]).length > 0)),
      }
      : {
        isContentAdministrator: false,
        isAdministrator: false,
        isManager: false,
      };
  }

    public makeSession(rawUser: GO1User, instanceName: string) {
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
      const permissions = this.getPermissions(restAccount);

      return {
        user: restUser as GO1User,
        account: { ...restAccount, ...permissions} as GO1Account,
        portal: instance as GO1Portal,
        jwt,
      };
    }
}

export default function(http) {
  return new UserService(http);
}
