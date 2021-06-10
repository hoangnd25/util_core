import { mount } from 'enzyme';
import * as React from 'react';
import { I18nProvider } from '@lingui/react';
import ConfirmModal from './ConfirmModal';

const setup = (props?: any) => {
  return mount(
    <I18nProvider language="en" catalogs={{ en: { messages: {} } }}>
      <ConfirmModal {...props} />
    </I18nProvider>
  );
};

const applyCustomizationGroups = [
  'login',
  'portal_color',
  'featured_image',
  'certificate',
  'dashboard',
  'signup',
  'login',
];

it('Should render without portals count', () => {
  const wrapper = setup({
    isOpen: true,
    applyCustomizationGroups,
  });

  expect(wrapper.find('p[data-testid="confirm-modal-message"]').text()).toEqual(
    'The following options will be applied to all customer portals. Do you want to continue?'
  );
});

it('Should render with portals count', () => {
  const wrapper = setup({
    isOpen: true,
    applyCustomizationGroups,
    customerPortalsCount: 10
  });

  expect(wrapper.find('p[data-testid="confirm-modal-message"]').text()).toEqual(
    'The following options will be applied to all 10 customer portals. Do you want to continue?'
  );
});
