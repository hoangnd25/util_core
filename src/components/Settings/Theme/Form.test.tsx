import * as React from 'react';
import { I18nProvider } from '@lingui/react';
import { GO1Portal, GO1User } from '@src/types/user';
import { renderHook } from '@testing-library/react-hooks';
import { Value } from 'slate';
import { Trans } from '@lingui/macro';
import AppContext from '@src/utils/appContext';
import create from '@src/utils/http';
import MockAdapter from 'axios-mock-adapter';
import { fireEvent, render, act, screen, waitFor } from '@testing-library/react';
import ThemeSettingsForm from './Form';
import { ThemeSettingsFormProps } from './types';
import { useThemeSettingsFormHandler } from './Form.hooks';
import { ApplyCustomizationdError, FormSaveError, ImageUploadError } from './errors';

const defaultPortal = {
  title: 'test.mygo1.com',
  files: {
    login_background: 'https://cloudinary_image.jpg',
    dashboard_icon: 'https://cloudinary_image..jpg',
    feature_image: 'https://cloudinary_image..jpg',
    feature_image_sizing_type: 'fixed-width',
  },
  configuration: {
    signature_title: 'Signature title',
    signature_name: 'Signature fullname',
    signature_image: 'https://signature-image.jpg',
    welcome: '<p>Halo</p>',
  },
  data: {
    theme: {
      primary: '#CCCCCC',
    },
  },
};

const INPUTS = {
  logo: '[name="logo"] input[type="file"]',
  featuredImage: '[name="featuredImage"] input[type="file"]',
  loginTitle: 'input[name="loginTitle"]',
  loginDescription: 'input[name="loginDescription"]',
  signupTitle: 'input[name="signupTitle"]',
  signupDescription: 'input[name="signupDescription"]',
  portalColor: '[for="portalColor"]',
  signatureTitle: 'input[name="signatureTitle"]',
  signatureName: 'input[name="signatureName"]',
  signatureImage: '[name="signatureImage"] input[type="file"]',
  dashboardWelcomeMessage: '[for="dashboardWelcomeMessage"] [contenteditable="true"]',
  dashboardImageScale: 'input[name="dashboardImageScale"]',
  dashboardImage: '[name="dashboardImage"] input[type="file"]',
  dashboardIcon: '[name="dashboardIcon"] input[type="file"]',
};

const APPLY_CHILD_PORTAL_INPUTS = {
  applyCustomizationLogo: 'input[type="checkbox"][name="applyCustomizationLogo"]',
  applyCustomizationPortalColor: 'input[type="checkbox"][name="applyCustomizationPortalColor"]',
  applyCustomizationFeaturedImage: 'input[type="checkbox"][name="applyCustomizationFeaturedImage"]',
  applyCustomizationCertificate: 'input[type="checkbox"][name="applyCustomizationCertificate"]',
  applyCustomizationDashboard: 'input[type="checkbox"][name="applyCustomizationDashboard"]',
  applyCustomizationLogin: 'input[type="checkbox"][name="applyCustomizationLogin"]',
  applyCustomizationSignup: 'input[type="checkbox"][name="applyCustomizationSignup"]',
};

let mock: MockAdapter;
const http = create();

beforeEach(() => {
  mock = new MockAdapter(http);
  window.URL.createObjectURL = jest.fn();
});

const setup = (props?: ThemeSettingsFormProps) => {
  return render(
    <AppContext.Provider value={{ http, cookies: {} }}>
      <I18nProvider language="en" catalogs={{ en: { messages: {} } }}>
        <ThemeSettingsForm {...props} />
      </I18nProvider>
    </AppContext.Provider>
  );
};

beforeEach(() => {
  window.URL.revokeObjectURL = jest.fn();
  window.getSelection = jest.fn();
});

it('Should render all fields correctly', () => {
  const { container } = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    user: {} as GO1User,
    portal: {
      ...defaultPortal,
      type: 'distribution_partner',
    } as GO1Portal,
  });
  Object.entries({ ...INPUTS, ...APPLY_CHILD_PORTAL_INPUTS }).forEach(([_, selector]) => {
    expect(container.querySelectorAll(selector).length).toBeGreaterThanOrEqual(1);
  });
});

it('Should not render apply customization checkboxes for non partner portal', () => {
  const { container } = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    portal: defaultPortal as GO1Portal,
    user: {} as GO1User,
  });
  Object.entries(APPLY_CHILD_PORTAL_INPUTS).forEach(([_, selector]) => {
    expect(container.querySelectorAll(selector)).toHaveLength(0);
  });
});

it('Should ignore unchanged fields for submit', async (done) => {
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const uploadFn = jest.fn().mockResolvedValue('https://uploaded-image.jpg');
  const { getByText } = setup({
    onSave: saveFn,
    onUpload: uploadFn,
    portal: defaultPortal as GO1Portal,
    user: {} as GO1User,
  });

  fireEvent.click(getByText('Save changes'));

  await waitFor(async () => {
    expect(saveFn).toHaveBeenCalledWith({}, []); // fields unchanged, save callback should receive an empty object
    done();
  });
});

it('Should show confirm modal for apply child portal customization', async (done) => {
  mock.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {
    partner_child_portals_number: 10,
  });
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const { container, getByText } = setup({
    onSave: saveFn,
    onUpload: jest.fn(),
    portal: {
      ...defaultPortal,
      type: 'distribution_partner',
    } as any,
    user: {} as GO1User,
  });

  // check apply certificate checkbox
  const applyCustomizationInput = container.querySelector(APPLY_CHILD_PORTAL_INPUTS.applyCustomizationCertificate);
  fireEvent.click(applyCustomizationInput);
  fireEvent.click(getByText('Save changes'));

  await waitFor(async () => {
    expect(screen.getByText('Confirm changes')).toBeInTheDocument();
    expect(screen.getByText('Apply to all portals')).toBeInTheDocument();
    expect(saveFn).not.toHaveBeenCalled();
    done();
  });
});

it('Should be able to handle submit', async (done) => {
  const UPLOADED_URL = 'https://uploaded-image.jpg';
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const uploadFn = jest.fn().mockResolvedValue(UPLOADED_URL);
  const { result } = renderHook(() =>
    useThemeSettingsFormHandler({
      onSave: saveFn,
      onUpload: uploadFn,
      portal: defaultPortal as GO1Portal,
      user: {} as GO1User,
    })
  );

  const newPortalColor = '#FFFFFF';
  const newLoginTitle = 'Custom login title';
  const newLoginDescription = 'Custom login description';
  const newSignupTitle = 'Custom signup title';
  const newSignupDescription = 'Custom signup description';
  const newSignatureTitle = 'Custom signature title';
  const newSignatureName = 'Custom signature fullname';
  const newDashboardImageScale = 'fixed-height';
  const newDashboardWelcomeMessage = Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  text: 'Aloha',
                  object: 'leaf',
                },
              ],
            } as any,
          ],
        },
      ],
    },
  });
  const testFile = new File([new ArrayBuffer(1)], 'file.jpg');

  await act(async () => {
    result.current.setChangesConfirmed(true);
    await result.current.handleSubmit(
      {
        loginTitle: newLoginTitle,
        loginDescription: newLoginDescription,
        signupTitle: newSignupTitle,
        signupDescription: newSignupDescription,
        portalColor: newPortalColor,
        logo: testFile,
        featuredImage: testFile,
        signatureTitle: newSignatureTitle,
        signatureName: newSignatureName,
        signatureImage: testFile,
        dashboardWelcomeMessage: newDashboardWelcomeMessage,
        dashboardImageScale: newDashboardImageScale,
        dashboardImage: testFile,
        dashboardIcon: testFile,
        applyCustomizationCertificate: true,
        applyCustomizationLogin: true,
      },
      {
        setSubmitting: jest.fn(),
        setFieldValue: jest.fn(),
      } as any
    );
  });

  waitFor(() => {
    expect(saveFn).toHaveBeenCalledWith(
      {
        'files.logo': UPLOADED_URL,
        'files.login_background': UPLOADED_URL,
        'configuration.login_tagline': newLoginTitle,
        'configuration.login_secondary_tagline': newLoginDescription,
        'configuration.signup_tagline': newSignupTitle,
        'configuration.signup_secondary_tagline': newSignupDescription,
        'theme.primary': newPortalColor,
        'configuration.signature_title': newSignatureTitle,
        'configuration.signature_name': newSignatureName,
        'configuration.signature_image': UPLOADED_URL,
        'configuration.welcome': '<p>Aloha</p>',
        'files.feature_image_sizing_type': newDashboardImageScale,
        'files.feature_image': UPLOADED_URL,
        'files.dashboard_icon': UPLOADED_URL,
      },
      ['certificate', 'login']
    );
  });
  done();
});

it('Should be able to handle image upload error', async (done) => {
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const uploadFn = jest.fn().mockRejectedValueOnce(new ImageUploadError());
  const errorFn = jest.fn();
  const { result } = renderHook(() =>
    useThemeSettingsFormHandler({
      onSave: saveFn,
      onUpload: uploadFn,
      onError: errorFn,
      portal: defaultPortal as GO1Portal,
      user: {} as GO1User,
    })
  );

  const testFile = new File([new ArrayBuffer(1)], 'file.jpg');
  act(() => {
    result.current.handleSubmit(
      {
        featuredImage: testFile,
      },
      {
        setSubmitting: jest.fn(),
        setFieldValue: jest.fn(),
      } as any
    );
  });

  waitFor(() => {
    expect(errorFn).toHaveBeenCalledWith(
      <Trans>An unexpected error has occurred while uploading image. Please try again.</Trans>
    );
    done();
  });
});

it('Should be able to handle form saving error', async (done) => {
  const saveFn = jest.fn().mockRejectedValue(new FormSaveError());
  const uploadFn = jest.fn().mockResolvedValue('image.jpg');
  const errorFn = jest.fn();
  const { result } = renderHook(() =>
    useThemeSettingsFormHandler({
      onSave: saveFn,
      onUpload: uploadFn,
      onError: errorFn,
      portal: defaultPortal as GO1Portal,
      user: {} as GO1User,
    })
  );

  act(() => {
    result.current.handleSubmit(
      {
        loginTitle: 'new title',
      },
      {
        setSubmitting: jest.fn(),
        setFieldValue: jest.fn(),
      } as any
    );
  });

  waitFor(() => {
    expect(errorFn).toHaveBeenCalledWith(
      <Trans>An unexpected error has occurred while saving form. Please try again.</Trans>
    );
    done();
  });
});

it('Should be able to handle apply customization to child portals error', async (done) => {
  const saveFn = jest.fn().mockRejectedValue(new ApplyCustomizationdError());
  const uploadFn = jest.fn().mockResolvedValue('image.jpg');
  const errorFn = jest.fn();
  const { result } = renderHook(() =>
    useThemeSettingsFormHandler({
      onSave: saveFn,
      onUpload: uploadFn,
      onError: errorFn,
      portal: defaultPortal as GO1Portal,
      user: {} as GO1User,
    })
  );

  act(() => {
    result.current.handleSubmit(
      {
        loginTitle: 'new title',
      },
      {
        setSubmitting: jest.fn(),
        setFieldValue: jest.fn(),
      } as any
    );
  });

  waitFor(() => {
    expect(errorFn).toHaveBeenCalledWith(
      <Trans>
        An unexpected error has occurred while applying customization to customer portals. Please try again.
      </Trans>
    );
    done();
  });
});

it('Should show dashboard preview modal', () => {
  const { getByText } = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    portal: defaultPortal as GO1Portal,
    user: {} as GO1User,
  });

  fireEvent.click(getByText('Preview dashboard'));

  screen.getAllByTestId('preview-dashboard-icon').forEach((elem) => {
    expect(elem.getAttribute('src')).toEqual(defaultPortal.files.dashboard_icon);
  });
  expect(window.getComputedStyle(screen.getByTestId('preview-dashboard-image')).backgroundImage).toContain(
    defaultPortal.files.feature_image
  );
  expect(screen.getByTestId('preview-dashboard-welcome-message').innerHTML).toEqual(
    defaultPortal.configuration.welcome
  );
  expect(screen.getByText('Close preview')).toBeInTheDocument();
});

it('Should show brand preview modal', () => {
  const { getByText } = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    portal: defaultPortal as GO1Portal,
    user: {} as GO1User,
  });

  fireEvent.click(getByText('Preview brand'));

  expect(window.getComputedStyle(screen.getByTestId('preview-split-featured-image')).backgroundImage).toContain(
    defaultPortal.files.login_background
  );

  const submitButton = screen.getByTestId('preview-split-submit-button');
  expect(window.getComputedStyle(submitButton).backgroundColor).toEqual(
    'rgb(204, 204, 204)' // rgb value of #cccccc
  );
  expect(submitButton.textContent).toEqual('Create new account');

  expect(screen.getByText('Close preview')).toBeInTheDocument();
});

it('Should show login preview modal', () => {
  const { getByText } = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    portal: defaultPortal as GO1Portal,
    user: {} as GO1User,
  });

  fireEvent.click(getByText('Preview login'));

  const submitButton = screen.getByTestId('preview-split-submit-button');
  expect(submitButton.textContent).toEqual('Log in');

  expect(screen.getByText('Close preview')).toBeInTheDocument();
});

it('Should show signup preview modal', () => {
  const { getByText } = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    portal: defaultPortal as GO1Portal,
    user: {} as GO1User,
  });

  fireEvent.click(getByText('Preview sign up'));

  const submitButton = screen.getByTestId('preview-split-submit-button');
  expect(submitButton.textContent).toEqual('Create new account');

  expect(screen.getByText('Close preview')).toBeInTheDocument();
});
