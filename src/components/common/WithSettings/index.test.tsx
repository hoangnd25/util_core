import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { View } from '@go1d/go1d';
import CommonProvider from '@go1d/mine/common/Provider';
import { I18nProvider } from '@lingui/react';
import en from '@src/locale/en/messages';
import LinkComponent from '@src/components/common/Link';
import authenticatedStoreState from '@src/store/mocks/authenticatedStore';
import withSettings from '.';
import { CurrentSessionType } from '@src/types/user';

/** TEST SETUP * */
let Component;

class App extends React.Component {
  render = () => <View />;
}

const mockStore = configureStore([]);

const currentSession = {
  portal: {
    id: '123456',
    title: 'TestMb',
    configuration: {
      integrations: {
        scorm: {
          status: true,
        },
      },
    },
    data: {},
    featureToggles: [{ raw: { name: 'xAPI', enabled: true } }],
    files: {},
  },
  authenticated: true,
} as CurrentSessionType;

const setup = ({ pageTitle = 'Theme', active = 'theme' }, initialState = {}) => {
  const store = mockStore({ ...authenticatedStoreState, ...initialState });
  Component = withSettings(App, {
    pageTitle,
    active,
  });
  return mount(
    <CommonProvider linkComponent={LinkComponent}>
      <Provider store={store}>
        <I18nProvider language="en" catalogs={{ en }}>
          <Component currentSession={currentSession} />
        </I18nProvider>
      </Provider>
    </CommonProvider>
  );
};

/** TEST SETUP END * */

it('WithSettings: renders correctly', async () => { 
  const wrapper = setup({});
  await Promise.resolve();
  expect(wrapper.find('LayoutWithSideNav').length).toBe(1);
  expect(wrapper.find('h1').text()).toBe('Theme');
})

it('WithSettings: renders correctly in embeddedMode', async () => {
  const wrapper = setup({}, { runtime: { embeddedMode: true } });
  await Promise.resolve();
  expect(wrapper.find('TopMenu').length).toBe(0);
});
