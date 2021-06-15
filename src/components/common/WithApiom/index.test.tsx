import { mount } from 'enzyme';
import * as React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import CommonProvider from '@go1d/mine/common/Provider';
import { I18nProvider } from '@lingui/react';
import LinkComponent from '@src/components/common/Link';
import authenticatedStoreState from '@src/store/mocks/authenticatedStore';
import { CurrentSessionType } from '@src/types/user';
import withApiom from '@src/components/common/WithApiom';
import ScormAndXapi, { scormService } from '@src/pages/r/app/portal/integrations/scorm-and-xapi';
import ThemeSettingsPage from '@src/pages/r/app/portal/settings/theme';

/** TEST SETUP * */
let Component;

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

const settingsMenuMock = {
  id: 'sidebar.settings-portal-information',
  title: 'Portal Information',
  subtitle: 'Portal info, legal and login config',
  href: 'app/settings/information',
  isApiomLink: true,
  isVisible: true,
};

const integrationsMenuMock = {
  id: 'sidebar.integrations-addons',
  title: 'Addons',
  href: 'app/integrations/addons',
  isApiomLink: true,
  isVisible: true,
};

const i18nProps = {
  i18n: { _: jest.fn() },
} as any;

const setup = (App, props, initialState = {}) => {
  const store = mockStore({ ...authenticatedStoreState, ...initialState });

  Component = withApiom(App, {
    ...props,
  });

  return mount(
    <CommonProvider linkComponent={LinkComponent}>
      <Provider store={store}>
        <I18nProvider language="en" catalogs={{ en: { messages: {} } }} {...i18nProps}>
          <Component currentSession={currentSession} {...props} />
        </I18nProvider>
      </Provider>
    </CommonProvider>
  );
};

beforeEach(() => {
  jest.spyOn(scormService, 'getApplicationId').mockResolvedValue('Existing Application ID');
  // stub getSelection for RichTextInput in theme settings page
  window.getSelection = jest.fn();
});

/** TEST SETUP END * */

it('withApiom: Integrations menu renders correctly', async () => {
  const wrapper = setup(ScormAndXapi, {
    pageTitle: 'Example',
    active: 'sidebar.integrations-scorm_and_api',
    menuType: 'Integrations',
  });
  await Promise.resolve();
  const PageInstance = wrapper.find(ScormAndXapi) as any;
  const sideMenuInstance = PageInstance.find('LayoutWithSideNav');
  const sideMenu = PageInstance.props().menu[0];
  expect(sideMenu).toEqual(integrationsMenuMock);
  expect(sideMenuInstance.length).toBe(1);
});

it('withApiom: Integrations menu renders correctly in embeddedMode', async () => {
  const wrapper = setup(
    ScormAndXapi,
    { pageTitle: 'Example', active: 'sidebar.integrations-scorm_and_api', menuType: 'Integrations' },
    { runtime: { embeddedMode: true } }
  );
  await Promise.resolve();
  const PageInstance = wrapper.find(ScormAndXapi) as any;
  const sideMenu = PageInstance.props().menu[0];
  expect(sideMenu).toEqual(integrationsMenuMock);
  expect(wrapper.find('TopMenu').length).toBe(0);
});

it('withApiom: Settings menu renders correctly in embeddedMode', async () => {
  const wrapper = setup(
    ThemeSettingsPage,
    { pageTitle: 'Example', active: 'sidebar.settings-theme', menuType: 'Settings' },
    { runtime: { embeddedMode: true } }
  );
  await Promise.resolve();
  const PageInstance = wrapper.find(ThemeSettingsPage) as any;
  const sideMenu = PageInstance.props().menu[0];
  expect(sideMenu).toEqual(settingsMenuMock);
  expect(wrapper.find('TopMenu').length).toBe(0);
});

it('withApiom: Settings menu renders correctly', async () => {
  const wrapper = setup(ThemeSettingsPage, {
    pageTitle: 'Examples',
    active: 'sidebar.settings-theme',
    menuType: 'Settings',
  });
  await Promise.resolve();
  const PageInstance = wrapper.find(ThemeSettingsPage) as any;
  const sideMenuInstance = PageInstance.find('LayoutWithSideNav');
  const sideMenu = PageInstance.props().menu[0];
  expect(sideMenu).toEqual(settingsMenuMock);
  expect(sideMenuInstance.length).toBe(1);
});
