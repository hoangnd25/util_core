interface CreateFetchKnowingCookieRead {
  credentials: string;
  headers: {};
}

type TNetWorkPorts = (url: string, options: {}) => Promise<{}>;
let networkPorts: TNetWorkPorts;

if (process.env.BROWSER) {
  // tslint:disable-next-line no-var-requires
  networkPorts = require('../core/fetch/fetch.client');
} else {
  // tslint:disable-next-line no-var-requires
  networkPorts = require('../core/fetch/fetch.server');
}

function createRequest() {
  return Promise.resolve({});
}

function createFetchKnowingCookie({ cookie }: IConfigureStoreHelpersConfig) {
  if (!process.env.BROWSER) {
    return (url: string, options: CreateFetchKnowingCookieRead = { credentials: '', headers: {} }) => {
      const isLocalUrl = /^\/($|[^/])/.test(url);

      // pass cookie only for itself.
      // We can't know cookies for other sites BTW
      if (isLocalUrl && options.credentials === 'include') {
        const headers = {
          ...options.headers,
          cookie,
        };
        return networkPorts(url, { ...options, headers });
      }

      return networkPorts(url, options);
    };
  }

  return networkPorts;
}

export default function createHelpers(config: IConfigureStoreHelpersConfig) {
  const fetchKnowingCookie = createFetchKnowingCookie(config);
  const request = createRequest();

  return {
    fetch: fetchKnowingCookie,
    history: config.history,
    request,
  };
}
