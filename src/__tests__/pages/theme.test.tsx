import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ThemeSettingsPage from '@src/pages/r/app/portal/settings/theme';
import { CurrentSessionType } from '@src/types/user';
import { WithRouterProps } from 'next/dist/client/with-router';

import { NotificationContainer } from '@go1d/go1d';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AppContext from '@src/utils/appContext';
import { HttpInstance } from '@src/utils/http';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

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

  // I won't bring top menu here
  const runtime = {
    embeddedMode: true,
  };
  const mockStore = configureMockStore();
  const http = axios.create() as HttpInstance;
  // Try not to set the header to keep it clean
  // somehow it fails when use the `create` function exported from http above
  http.setJWT = () => {};

  const adapter = new MockAdapter(http);

  const wrapper = render(
    <AppContext.Provider
      value={{
        http,
        cookies: {},
      }}
    >
      <ReduxProvider store={mockStore({ currentSession, runtime })}>
        <ThemeSettingsPage currentSession={currentSession} {...componentProps} />
      </ReduxProvider>
      <NotificationContainer />
    </AppContext.Provider>
  );

  return {
    wrapper,
    props,
    adapter,
  };
};

beforeEach(() => {
  window.URL.revokeObjectURL = jest.fn();
  window.getSelection = jest.fn();
});

it('should be able to submit form successfully', async () => {
  const { adapter } = setup();

  adapter.onPost('/portal/test.mygo1.com').reply(200, {
    status: 'ok',
  });

  expect(screen.queryByTestId('theme_settings_page')).toBeInTheDocument();
  expect(screen.queryByText('Save changes')).toBeInTheDocument();

  fireEvent.submit(screen.queryByText('Save changes'));

  await waitFor(() => expect(screen.queryByText('The settings have been saved.')).toBeInTheDocument());
});
