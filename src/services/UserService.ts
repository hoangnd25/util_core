/* istanbul ignore file  */

class UserService {
  public http = null;

  constructor(http) {
    this.http = http;
    return this;
  }

  public async getCurrentAccount(params?: { portal: string; uuid: string }): Promise<Account> {
    const url = params ? `/user/account/current/${params.uuid}/${params.portal}?allPortals=false` : `/user/account/current`;
    const resp = await this.http.get(url);

    return resp.data;
  }
}

export default function(http) {
  return new UserService(http);
}
