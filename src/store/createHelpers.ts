export default function createHelpers(config: any) {
  return {
    http: config.http,
    cookies: config.cookies,
  };
}
