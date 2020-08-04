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
import withIntegrations from '.';

/** TEST SETUP * */
let Component;

class App extends React.Component {
  render = () => <View />
}

const mockStore = configureStore([]);

const currentSession = {
  portal: {
    configuration: {
      integrations: {
        scorm: {
          status: true 
        }
      }
    },
    featureToggles: [
      { raw: { name: 'xAPI', enabled: true } }
    ]
  }
}

const setup = ({ pageTitle = 'Example', active = 'microsoft-azure' }) => {
  const store = mockStore(authenticatedStoreState);
  Component = withIntegrations(App, {
    pageTitle,
    active
  });
  return mount(
    <CommonProvider linkComponent={LinkComponent}>
      <Provider store={store}>
        <I18nProvider language="en" catalogs={{en}}>
          <Component currentSession={currentSession} />
        </I18nProvider>
      </Provider>
    </CommonProvider>
  );
};

/** TEST SETUP END * */

it('renders correctly', done => {
  const wrapper = setup({}) as any;
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find("LayoutWithSideNav").length).toBe(1);
    expect(wrapper.find("h1").text()).toBe('Example');
    done();
  });
});
