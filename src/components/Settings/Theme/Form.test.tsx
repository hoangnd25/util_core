import { mount } from 'enzyme';
import * as React from 'react';
import { I18nProvider } from '@lingui/react';
import { GO1Portal } from '@src/types/user';
import { renderHook, act } from '@testing-library/react-hooks';
import ThemeSettingsForm, { ThemeSettingsFormProps, useThemeSettingsFormHandler } from './Form';

const defaultPortal = {
  files: {
    logo: 'https://logo.jpg',
    login_background: 'https://featured-image.jpg',
  },
  configuration: {
    signature_title: 'Signature title',
    signature_name: 'Signature fullname',
    signature_image: 'https://signature-image.jpg',
  },
  data: {
    theme: {
      primary: '#CCCCCC',
    },
  },
};

const INPUT = {
  logo: 'ImageUploadSlat[name="logo"]',
  featuredImage: 'ImageUploader[name="featuredImage"]',
  loginTitle: 'TextInput[name="loginTitle"]',
  loginDescription: 'TextInput[name="loginDescription"]',
  signupTitle: 'TextInput[name="signupTitle"]',
  signupDescription: 'TextInput[name="signupDescription"]',
  portalColor: 'ColorPicker[name="portalColor"]',
  signatureTitle: 'TextInput[name="signatureTitle"]',
  signatureName: 'TextInput[name="signatureName"]',
  signatureImage: 'ImageUploadSlat[name="signatureImage"]',
};

const setup = (props?: ThemeSettingsFormProps) => {
  return mount(
    <I18nProvider language="en" catalogs={{ en: { messages: {} } }}>
      <ThemeSettingsForm {...props} />
    </I18nProvider>
  );
};

beforeEach(() => {
  global.URL.revokeObjectURL = jest.fn();
});

it('Should render with correct fields', () => {
  const wrapper = setup({
    onSave: jest.fn(),
    onUpload: jest.fn(),
    portal: defaultPortal as GO1Portal,
  });

  Object.entries(INPUT).forEach(([_, selector]) => {
    expect(wrapper.find(selector)).toHaveLength(1);
  });
});

it('Should ignore unchanged fields for submit', async done => {
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const uploadFn = jest.fn().mockResolvedValue('https://uploaded-image.jpg');
  const wrapper = setup({
    onSave: saveFn,
    onUpload: uploadFn,
    portal: defaultPortal as GO1Portal,
  });

  wrapper.find('Form').simulate('submit');

  setImmediate(() => {
    expect(saveFn).toHaveBeenCalledWith({}); // fields unchanged, save callback should receive an empty object
    done();
  });
});

it('Should be able to handle submit', async done => {
  const UPLOADED_URL = 'https://uploaded-image.jpg';
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const uploadFn = jest.fn().mockResolvedValue(UPLOADED_URL);
  const { result, waitFor } = renderHook(() =>
    useThemeSettingsFormHandler({
      onSave: saveFn,
      onUpload: uploadFn,
      portal: defaultPortal as GO1Portal,
    })
  );

  const newPortalColor = '#FFFFFF';
  const newLoginTitle = 'Custom login title';
  const newLoginDescription = 'Custom login description';
  const newSignupTitle = 'Custom signup title';
  const newSignupDescription = 'Custom signup description';
  const newSignatureTitle = 'Custom signature title';
  const newSignatureName = 'Custom signature fullname';
  const testFile = new File([new ArrayBuffer(1)], 'file.jpg');

  act(() => {
    result.current.handleSubmit(
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
      },
      {
        setSubmitting: jest.fn(),
        setFieldValue: jest.fn(),
      } as any
    );
  });

  waitFor(() => {
    expect(saveFn).toHaveBeenCalledWith({
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
    });
    done();
  });
});
