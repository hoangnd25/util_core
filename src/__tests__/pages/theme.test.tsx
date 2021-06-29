import * as React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import ThemeSettingsPage, {
  ThemeSettingsPage as ThemeSettingsPageComponent,
} from '@src/pages/r/app/portal/settings/theme';
import { CurrentSessionType } from '@src/types/user';
import { WithRouterProps } from 'next/dist/client/with-router';
import { I18nProvider } from '@lingui/react';
import { ImageUploadError } from '@src/components/Settings/Theme/errors';
import { NotificationContainer } from '@go1d/go1d';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from '@src/utils/appContext';
import { HttpInstance } from '@src/utils/http';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { uploadImageFn } from '@src/__mocks__/@go1d/mine/services/cloudinary';

beforeEach(() => {
  window.URL.createObjectURL = jest.fn();
});

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
  user: {
    id: 1,
  },
  account: {
    id: 1,
    mail: 'test@go1.com',
    isAdministrator: true,
    uuid: 'uuid',
  },
} as CurrentSessionType;

const mockProps = {
  router: {
    pathname: '/',
  } as WithRouterProps['router'],

  dispatch: jest.fn(),
  scrollToTop: jest.fn(),
};

const setup = (props: any = {}) => {
  const componentProps = {
    ...props,
    ...mockProps,
  };

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
      <ReduxProvider store={mockStore({ currentSession: componentProps.currentSession || currentSession, runtime })}>
        <ThemeSettingsPage {...componentProps} />
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

const setupComponent = () => {
  const ref = React.createRef<ThemeSettingsPageComponent>();
  const http = axios.create() as HttpInstance;
  const adapter = new MockAdapter(http);

  const wrapper = render(
    <AppContext.Provider
      value={{
        http,
        cookies: {},
      }}
    >
      <I18nProvider language="en" catalogs={{ en: { messages: {} } }}>
        <ThemeSettingsPageComponent currentSession={currentSession} {...mockProps} ref={ref} />
        <NotificationContainer />
      </I18nProvider>
    </AppContext.Provider>
  );

  return { ref, wrapper, adapter };
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

  adapter.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {
    partner_child_portals_number: 10,
  });

  expect(screen.queryByTestId('theme_settings_page')).toBeInTheDocument();
  expect(screen.queryByText('Save changes')).toBeInTheDocument();

  fireEvent.submit(screen.queryByText('Save changes'));

  await waitFor(() => expect(screen.queryByText('The settings have been saved.')).toBeInTheDocument());
});

it('should be able to submit form successfully with child portals', async () => {
  const { adapter } = setup({
    currentSession: {
      ...currentSession,
      portal: {
        ...currentSession.portal,
        type: 'distribution_partner',
      },
    },
  });

  adapter.onPost('/portal/test.mygo1.com').reply(200, {
    status: 'ok',
  });

  adapter.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {
    partner_child_portals_number: 10,
  });

  userEvent.type(screen.getByLabelText('Login title'), 'Custom login title');
  userEvent.click(screen.getByText('Apply login customization to customer portals'));
  userEvent.click(screen.queryByText('Save changes'));

  await waitFor(() => {
    expect(screen.queryByText('Confirm changes')).toBeInTheDocument();
  });

  userEvent.click(screen.queryByText('Apply to all portals'));
  await waitFor(() => expect(screen.queryByText('The settings have been saved.')).toBeInTheDocument());
});

it('should be able to handle successful image upload', async () => {
  const { ref } = setupComponent();
  const file = new File(['test'], 'test.png', { type: 'image/png' });
  const cancelToken = axios.CancelToken.source();

  await ref.current?.handleImageUpload(file, cancelToken.token);
  expect(uploadImageFn).toHaveBeenCalledWith(
    {
      file,
      mail: currentSession.account.mail,
    },
    cancelToken.token
  );
});

it('should be able to handle failed image upload', async () => {
  const { ref } = setupComponent();
  const file = new File(['test'], 'test.png', { type: 'image/png' });
  const cancelToken = axios.CancelToken.source();

  uploadImageFn.mockRejectedValueOnce(new Error('Failed upload'));
  await expect(ref.current?.handleImageUpload(file, cancelToken.token)).rejects.toEqual(
    new ImageUploadError('Failed upload')
  );
});

it('should be able to display error message', async () => {
  const { ref } = setupComponent();
  ref.current?.handleError('Image upload failed');

  waitFor(() => {
    expect(screen.getByText('Image upload failed')).toBeInTheDocument();
  });
});
