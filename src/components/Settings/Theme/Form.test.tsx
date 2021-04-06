import { mount } from 'enzyme';
import * as React from 'react';
import { I18nProvider } from '@lingui/react';
import waitForExpect from 'wait-for-expect';
import ThemeSettingsForm, { ThemeSettingsFormProps } from './Form';

const setup = (props?: ThemeSettingsFormProps) => {
  return mount(
    <I18nProvider language="en" catalogs={{ en: { messages: {} } }}>
      <ThemeSettingsForm {...props} />
    </I18nProvider>
  );
};

it('Should render with correct fields', () => {
  const wrapper = setup();

  expect(wrapper.find('ImageUploadSlat[name="logo"]')).toHaveLength(1);
  expect(wrapper.find('ImageUploader[name="featuredImage"]')).toHaveLength(1);
});

it('Should be able to handle submit', async () => {
  global.URL.revokeObjectURL = jest.fn();
  const saveFn = jest.fn().mockResolvedValue(undefined);
  const uploadFn = jest.fn().mockResolvedValue('https://uploaded-image.jpg');
  const wrapper = setup({
    onSave: saveFn,
    onUpload: uploadFn,
    portal: {
      files: {
        logo: 'https://logo.jpg',
        feature_image: 'https://featured-image.jpg',
      },
    },
  });

  wrapper.find('Form').simulate('submit');
  await waitForExpect(() => {
    expect(saveFn).toHaveBeenCalledWith({
      'files.logo': undefined, // skip update for existing image
      'files.feature_image': undefined, // skip update for existing image
    });
    expect(uploadFn).not.toHaveBeenCalled();
  }, 500);
});
