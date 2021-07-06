require("@testing-library/jest-dom")
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

const config = require('./next.config');
// Make sure api endpoint does not use prod one
config.publicRuntimeConfig.ENV = 'test';
config.publicRuntimeConfig.API_URL = 'https://api-dev.go1.co';
config.publicRuntimeConfig.PORT = 80;
config.publicRuntimeConfig.CDN_PATH = 'https://test_cdn_path'

// Make sure you can use "publicRuntimeConfig" within tests.
jest.mock('next/config', () => () => ({ publicRuntimeConfig: config.publicRuntimeConfig }));

Enzyme.configure({ adapter: new Adapter() });

global.__DEV__ = false;
