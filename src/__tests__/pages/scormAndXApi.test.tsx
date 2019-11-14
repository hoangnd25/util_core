import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import CommonProvider from '@go1d/mine/common/Provider';
import { ScormAndXapi as ScormAndXapiPage, scormService } from '@src/pages/integrations/scormAndXApi/index';

const mockStore = configureMockStore();
const intlMock = {
  formatMessage: jest.fn(),
};

const setup = (props = { featureToggles: {} }) => {
  const { featureToggles, ...nestProps } = props;
  const currentSession = {
    portal: {
      id: 123,
    },
    account: {
      id: 123,
      isAdministrator: true,
    },
  };

  return mount(
    <ReduxProvider store={mockStore({ currentSession })}>
      <IntlProvider locale="en">
        <CommonProvider pushNavigationState={jest.fn()} apiUrl="api.go1.co" jwt="jwt" accountId={123} portalId={456}>
          <ScormAndXapiPage intl={intlMock} currentSession={currentSession} featureToggles={featureToggles} {...nestProps} />
        </CommonProvider>
      </IntlProvider>
    </ReduxProvider>
  );
};

it('Should render without crashing', () => {
  setup();
});

it('Should render existing application id', () => {
  spyOn(scormService, 'getApplicationId').and.callFake(() => Promise.resolve('Existing Application ID'));

  const ComponentWrapper = setup();
  const hasApplicationID = ComponentWrapper.find('View[data-testid="scormAndXApi.hasApplicationID"]');
  expect(hasApplicationID).not.toBeNull();
});

it('Should render generate application id', () => {
  spyOn(scormService, 'getApplicationId').and.callFake(() => Promise.reject());

  const ComponentWrapper = setup();
  const hasApplicationID = ComponentWrapper.find('View[data-testid="scormAndXApi.hasApplicationID"]');
  expect(hasApplicationID).toHaveLength(0);
});
