import Cookies from 'universal-cookie';
import { getNested } from '@go1d/mine/utils';
import { getStorage } from './storage';

const defaultCookies = new Cookies();

export default function extractGo1Metadata(cookies: Cookies = defaultCookies) {
  const go1Cookies = getNested(cookies, 'cookies.go1', null);

  // Try to get from Cookie
  if (go1Cookies) {
    const [uuid, instanceId, portalName, jwt] = go1Cookies.split(':');

    return {
      jwt,
      uuid,
      instanceId, // deprecated, should use `portalId` instead
      portalId: instanceId,
      portalName,
    }
  }


  // Fallback to localStorage if Cookie doesn't exist
  if (typeof window !== 'undefined') {
    const jwt = getStorage('jwt');
    const uuid = getStorage('uuid');
    const instanceId = getStorage('active-instance');
    const portalName = getStorage('active-instance-domain');

    return {
      jwt,
      uuid,
      instanceId,
      portalId: instanceId,
      portalName,
    }
  }

  return {
    jwt: undefined,
    uuid: undefined,
    instanceId: undefined,
    portalId: undefined,
    portalNam: undefined,
  }
}
