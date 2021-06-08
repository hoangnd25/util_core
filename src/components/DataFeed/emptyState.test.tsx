import { mount } from 'enzyme';
import * as React from 'react';
import { setupI18n } from '@lingui/core';
import { EmptyState } from '@go1d/go1d';
import DataFeedEmptyState from './emptyState';

const fakeOnStart = jest.fn();
const i18n = setupI18n({ language: 'en', catalogs: { en: {
  messages: {}
} } });

const setup = (props = {}) => {
  return mount(
    <DataFeedEmptyState i18n={i18n} onStart={fakeOnStart} {...props} />
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
