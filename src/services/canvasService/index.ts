import Cookies from 'universal-cookie';
import createHttp, { HttpInstance } from '@src/utils/http';
import BaseService from '@src/services/baseService';

const defaultHttp = createHttp();

export interface SSOConnectionDetails {}

export type CanvasIntegrationDetails = {
  connected?: boolean
  connectionId?: number
  domain: string
  client_id: string
  client_secret: string
}

export type ConnectionDetails = {
  id: number
  connection_name: string
  connection_identifier: string
  strategy: string
  portal_id: number
  user_id_attribute: string
  user_id_value: string
  enabled: string
  created_time: number
  updated_time: number
  identity_provider: string
  configuration: OAuth2GenericConfiguration
}
export type OAuth2GenericConfiguration = {
  domain: string
  auth_url: string
  token_url: string
  client_id: string
  client_secret: string
}

export type CanvasMutationReponse = {
  authUrl?: string
}

class CanvasService extends BaseService {
  constructor(http: HttpInstance = defaultHttp, go1CookieValue?: Cookies) {
    super(http, go1CookieValue);
  }

  private retrieveAuthUrl(portalName: string): Promise<{data: {redirectUrl: string}}> {
    const jwt = localStorage.getItem('jwt')
    return this.http.get(
      `sso/oauth/canvas/portal/authorize?portal=${portalName}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )
  }

  public async getConfig(portalId: string): Promise<ConnectionDetails[]> {
    const { data } = await this.http.get(`sso/v2/connections/${portalId}?idps[]=canvas`)
    return data
  }

  public setConfig(portalId: string, portalName: string, settings: CanvasIntegrationDetails): Promise<{ redirectUrl: string }> {
    const jwt = localStorage.getItem('jwt')
    return this.http
      .post(
        `sso/v2/connections`,
        {
          portal_id: portalId,
          connection_name: portalName.replace('.', '-'),
          strategy: 'oauth 2.0',
          identity_provider: 'canvas',
          enabled: true,
          configuration: {
            auth_url: '/login/oauth2/auth',
            token_url: '/login/oauth2/token',
            domain: settings.domain,
            client_id: settings.client_id,
            client_secret: settings.client_secret,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          }
        }
      )
      .then(() => this.retrieveAuthUrl(portalName))
      .then(({ data: { redirectUrl }}) => ({ redirectUrl }))
  }

  public updateConfig(
    portalId: string,
    portalName: string,
    connectionId: number,
    settings: CanvasIntegrationDetails
  ): Promise<{ redirectUrl: string }> {
    const jwt = localStorage.getItem('jwt')
    return this.http
      .put(
        `sso/v2/connections/${connectionId}`,
        {
          portal_id: portalId,
          enabled: true,
          configuration: {
            auth_url: '/login/oauth2/auth',
            token_url: '/login/oauth2/token',
            ...settings,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          }
        },
      )
      .then(() => this.retrieveAuthUrl(portalName))
      .then(({ data: { redirectUrl }}) => ({ redirectUrl }))
  }

  public deleteConfig(portalId: string, connectionId: number, settings: CanvasIntegrationDetails): Promise<void> {
    const jwt = localStorage.getItem('jwt')
    return this.http
      .put(
        `sso/v2/connections/${connectionId}`,
        {
          portal_id: portalId,
          enabled: false,
          configuration: {
            auth_url: '/login/oauth2/auth',
            token_url: '/login/oauth2/token',
            ...settings,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          }
        }
      )
  }
}

export default function (http?: HttpInstance) {
  return new CanvasService(http);
}
