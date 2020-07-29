import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { setupI18n } from '@lingui/core';
import DataFeedEmptyState from './emptyState';
import { EmptyState } from '@go1d/go1d';
import en from '@src/locale/en/messages';

const fakeOnStart = jest.fn();
const i18n = setupI18n({ language: 'en', catalogs: {en} });

const setup = (props = {}) => {
  return mount(
    <IntlProvider locale="en">
      <DataFeedEmptyState i18n={i18n} onStart={fakeOnStart} {...props} />
    </IntlProvider>
  );
};

it('renders without crashing', () => {
  setup();
});

it('should call onStart', () => {
  const Component = setup();
  Component.find(EmptyState).prop('action')({} as any);
  expect(fakeOnStart).toHaveBeenCalled();
});
