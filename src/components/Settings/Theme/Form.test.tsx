import { mount } from 'enzyme';
import * as React from 'react';
import { I18nProvider } from '@lingui/react';
import { GO1Portal, GO1User } from '@src/types/user';
import { renderHook, act } from '@testing-library/react-hooks';
import { Value } from 'slate';
import { Trans } from '@lingui/macro';
import AppContext from '@src/utils/appContext';
import create from '@src/utils/http';
import MockAdapter from 'axios-mock-adapter';
import ThemeSettingsForm from './Form';
import { ThemeSettingsFormProps } from './types';
import { useThemeSettingsFormHandler } from './Form.hooks';
import { ApplyCustomizationdError, FormSaveError, ImageUploadError } from './errors';

const defaultPortal = {
  title: 'test.mygo1.com',
  files: {
    logo: 'https://logo.jpg',
    login_background: 'https://featured-image.jpg',
    dashboard_icon: 'https://dashboard-icon.jpg',
    feature_image: 'https://dashboard-image.jpg',
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
  logo: 'ImageUploader[name="logo"]',
  featuredImage: 'ImageUploader[name="featuredImage"]',
  loginTitle: 'TextInput[name="loginTitle"]',
  loginDescription: 'TextInput[name="loginDescription"]',
  signupTitle: 'TextInput[name="signupTitle"]',
  signupDescription: 'TextInput[name="signupDescription"]',
  portalColor: 'ColorPicker[name="portalColor"]',
  signatureTitle: 'TextInput[name="signatureTitle"]',
  signatureName: 'TextInput[name="signatureName"]',
  signatureImage: 'ImageUploader[name="signatureImage"]',
  dashboardWelcomeMessage: 'RichTextInput[name="dashboardWelcomeMessage"]',
  dashboardImageScale: 'RadioGroup[name="dashboardImageScale"]',
  dashboardImage: 'ImageUploader[name="dashboardImage"]',
  dashboardIcon: 'ImageUploader[name="dashboardIcon"]',
};

const APPLY_CHILD_PORTAL_INPUTS = {
  applyCustomizationLogo: 'Checkbox[name="applyCustomizationLogo"]',
  applyCustomizationPortalColor: 'Checkbox[name="applyCustomizationPortalColor"]',
  applyCustomizationFeaturedImage: 'Checkbox[name="applyCustomizationFeaturedImage"]',
  applyCustomizationCertificate: 'Checkbox[name="applyCustomizationCertificate"]',
  applyCustomizationDashboard: 'Checkbox[name="applyCustomizationDashboard"]',
  applyCustomizationLogin: 'Checkbox[name="applyCustomizationLogin"]',
  applyCustomizationSignup: 'Checkbox[name="applyCustomizationSignup"]',
};

let mock: MockAdapter;
const http = create();

beforeEach(() => {
  mock = new MockAdapter(http);
  window.URL.createObjectURL = jest.fn();
});

const setup = (props?: ThemeSettingsFormProps) => {
  return mount(
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
  const wrapper = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    user: {} as GO1User,
    portal: {
      ...defaultPortal,
      type: 'distribution_partner',
    } as GO1Portal,
  });
  Object.entries({ ...INPUTS, ...APPLY_CHILD_PORTAL_INPUTS }).forEach(([_, selector]) => {
    expect(wrapper.find(selector)).toHaveLength(1);
  });
});

it('Should not render apply customization checkboxes for non partner portal', () => {
  const wrapper = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    portal: defaultPortal as GO1Portal,
    user: {} as GO1User,
  });
  Object.entries(APPLY_CHILD_PORTAL_INPUTS).forEach(([_, selector]) => {
    expect(wrapper.find(selector)).toHaveLength(0);
  });
});

it('Should ignore unchanged fields for submit', async (done) => {
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const uploadFn = jest.fn().mockResolvedValue('https://uploaded-image.jpg');
  const wrapper = setup({
    onSave: saveFn,
    onUpload: uploadFn,
    portal: defaultPortal as GO1Portal,
    user: {} as GO1User,
  });

  wrapper.find('Form').simulate('submit');

  setImmediate(() => {
    expect(saveFn).toHaveBeenCalledWith({}, []); // fields unchanged, save callback should receive an empty object
    done();
  });
});

it('Should show confirm modal for apply child portal customization', async (done) => {
  mock.onGet('/portal/test.mygo1.com?includeChildPortalsCount=1').reply(200, {
    partner_child_portals_number: 10,
  });
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const wrapper = setup({
    onSave: saveFn,
    onUpload: jest.fn(),
    portal: {
      ...defaultPortal,
      type: 'distribution_partner',
    } as any,
    user: {} as GO1User,
  });

  act(() => {
    // check apply logo checkbox
    wrapper.find(`${APPLY_CHILD_PORTAL_INPUTS.applyCustomizationLogo} input`).simulate('change');
    wrapper.find('Form').simulate('submit');

    setImmediate(() => {
      wrapper.update();
      // confirm modal should be visible
      expect(wrapper.find('ConfirmModal').prop('isOpen')).toBeTruthy();
      expect(wrapper.find('p[data-testid="confirm-message"]').getDOMNode().textContent).toEqual(
        'The following options will be applied to all 10 customer portals. Do you want to continue?'
      );
      expect(saveFn).not.toHaveBeenCalled();
      done();
    });
  });
});

it('Should be able to handle submit', async (done) => {
  const UPLOADED_URL = 'https://uploaded-image.jpg';
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const uploadFn = jest.fn().mockResolvedValue(UPLOADED_URL);
  const { result, waitFor } = renderHook(() =>
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
  const { result, waitFor } = renderHook(() =>
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
  const { result, waitFor } = renderHook(() =>
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
  const { result, waitFor } = renderHook(() =>
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
