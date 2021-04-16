import { shallow } from 'enzyme';
import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { ThemeSettingsPage } from '@src/pages/r/app/portal/settings/theme';
import { CurrentSessionType } from '@src/types/user';
import { WithRouterProps } from 'next/dist/client/with-router';

const setup = (props = {}) => {
  const componentProps = {
    ...props,
    router: {
      pathname: '/',
    } as WithRouterProps['router'],
    
    dispatch: jest.fn(),
    scrollToTop: jest.fn(),
  };

  const currentSession = {
    authenticated: true,
    portal: {
      id: '123',
      title: 'test.mygo1.com',
      data: {},
      featureToggles: [],
      files: {
        logo: 'https://logo.jpg',
        feature_image: 'https://featured-image.jpg',
      },
      configuration: {},
    },
    account: {
      id: 1,
      mail: 'test@go1.com',
      isAdministrator: true,
      uuid: 'uuid',
    },
  } as CurrentSessionType;

  const mockStore = configureMockStore();

  const wrapper = shallow(
    <ReduxProvider store={mockStore({ currentSession })}>
      <ThemeSettingsPage currentSession={currentSession} {...componentProps} />
    </ReduxProvider>
  )
    .shallow()
    .shallow();

  return {
    wrapper,
    props,
  };
};

it('Should render without crashing', () => {
  const { wrapper } = setup();

  expect(wrapper.find('View[data-testid="theme_settings_page"]').length).toBe(1);
});
