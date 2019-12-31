import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from "redux-mock-store";
import CommonProvider from '@go1d/mine/common/Provider';
import Integrations from '@src/pages/r/app/portal/integrations';
import * as translationUtil from '@src/utils/translation';

const mockStore = configureMockStore();
const mockIntl = {
  formatMessage: (rawMessage: string) => rawMessage,
};

const setup = (props = { featureToggles: {} }) => {
  const currentSession = {
    portal: {
      id: 123,
      configuration: {
        integrations: {
          scorm: {
            label: 'SCORM',
            image: 'images/integrations/scorm.png',
            name: 'scorm',
            status: false,
            data: null
          },
          autopilot: {
            label: 'Autopilot',
            image: 'images/integrations/autopilot.png',
            name: 'autopilot',
            status: true,
            data: null
          },
          stripe: {
            label: 'Stripe',
            image: 'images/integrations/stripe.png',
            name: 'stripe',
            status: false,
            data: true
          },
        },
      },
    },
    account: {
      id: 123,
      isAdministrator: true,
    },
  };
  const { featureToggles, ...nestProps } = props;

  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <IntlProvider locale="en">
        <CommonProvider pushNavigationState={jest.fn()} apiUrl="api.go1.co" jwt="jwt" accountId={123} portalId={456}>
          <Integrations {...nestProps} intl={mockIntl} currentSession={currentSession} featureToggles={featureToggles} />
        </CommonProvider>
      </IntlProvider>
    </ReduxProvider>
  );
};

it('renders without crashing', () => {
  setup({
    featureToggles: {},
  });
});

it('Should returns sidebar menus', () => {
  const Element = setup({
    featureToggles: {},
  });
  const Page = Element.find(Integrations).instance() as any;
  const sidebarMenus = Page.getSidebarMenus(mockIntl);

  const expectedSidebarMenus = [{
    id: 'sidebar.integrations-addons',
    title: {
      id: 'sidebar.integrations-addons',
      defaultMessage: 'Add-ons',
    },
    href: 'app/integrations/addons',
    isApiomLink: true,
    isVisible: true,
  }, {
    id: 'sidebar.integrations-scorm',
    title: {
      id: 'sidebar.integrations-scorm',
      defaultMessage: 'SCORM',
    },
    href: 'app/integrations/addon/scorm',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-autopilot',
    title: {
      id: 'sidebar.integrations-autopilot',
      defaultMessage: 'Autopilot',
    },
    href: 'app/integrations/addon/autopilot',
    isApiomLink: true,
    isVisible: true,
  }, {
    id: 'sidebar.integrations-stripe',
    title: {
      id: 'sidebar.integrations-stripe',
      defaultMessage: 'Stripe',
    },
    href: 'app/integrations/addon/stripe',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-zapier',
    title: {
      id: 'sidebar.integrations-zapier',
      defaultMessage: 'Zapier',
    },
    href: 'app/integrations/addon/zapier',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-lti-provider',
    title: {
      id: 'sidebar.integrations-lti-provider',
      defaultMessage: 'LTI Provider',
    },
    href: 'app/integrations/addon/ltiprovider',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-vettrak',
    title: {
      id: 'sidebar.integrations-vettrak',
      defaultMessage: 'Vettrak',
    },
    href: 'app/integrations/addon/vettrak',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-wisenet',
    title: {
      id: 'sidebar.integrations-wisenet',
      defaultMessage: 'Wisenet',
    },
    href: 'app/integrations/addon/wisenet',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-xero',
    title: {
      id: 'sidebar.integrations-xero',
      defaultMessage: 'Xero',
    },
    href: 'app/integrations/addon/xero',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-successfactors',
    title: {
      id: 'sidebar.integrations-successfactors',
      defaultMessage: 'SuccessFactors',
    },
    href: 'app/integrations/addon/successfactors',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-azure',
    title: {
      id: 'sidebar.integrations-azure',
      defaultMessage: 'Microsoft Azure',
    },
    href: 'app/integrations/addon/azure',
    isApiomLink: true,
    isVisible: false,
  }, {
    id: 'sidebar.integrations-course-catalog',
    title: {
      id: 'sidebar.integrations-course-catalog',
      defaultMessage: 'Course Catalog',
    },
    href: 'app/integrations/embed',
    isApiomLink: true,
    isVisible: true,
  }, {
    id: 'sidebar.integrations-single-sign-on',
    title: {
      id: 'sidebar.integrations-single-sign-on',
      defaultMessage: 'Single Sign-On',
    },
    href: 'app/integrations/sso',
    isApiomLink: true,
    isVisible: true,
  }, {
    id: 'sidebar.integrations-developers',
    title: {
      id: 'sidebar.integrations-developers',
      defaultMessage: 'Developers',
    },
    href: 'app/integrations/developer',
    isApiomLink: true,
    isVisible: true,
  }, {
    id: 'sidebar.integrations-user-data-feed',
    title: {
      id: 'sidebar.integrations-user-data-feed',
      defaultMessage: 'User Data Feed',
    },
    href: '/integrations/user-data-feed',
    isApiomLink: false,
    isVisible: false,
  }];

  expect(sidebarMenus).toEqual(expectedSidebarMenus);
});

it('Should show user data feed menu', () => {
  const Element = setup({
    featureToggles: {
      'user-data-feed': true,
    },
  });
  const Page = Element.find(Integrations).instance() as any;
  const sidebarMenus = Page.getSidebarMenus(mockIntl) as any[];

  const dataFeedMenu = sidebarMenus.find(menu => menu.id === 'sidebar.integrations-user-data-feed');
  expect(dataFeedMenu.isVisible).toBeTruthy();
});

it('Should format message', () => {
  spyOn(translationUtil, 'getSidebarTexts').and.returnValue({ sidebarMenu: 'Sidebar Menu Title' });

  const Element = setup({
    featureToggles: {},
  });
  const Page = Element.find(Integrations).instance() as any;

  const actual = Page.getString('sidebarMenu', mockIntl);
  expect(actual).toEqual('Sidebar Menu Title');
});
