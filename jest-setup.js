const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

global.__DEV__ = false;
window.APP_CONFIG = {
  RES_CDN: 'http://res-cdn.go',
  API_ENDPOINT: 'https://dev.mygo1.com',
};
