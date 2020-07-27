import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import DataFeedEmptyState from './emptyState';
import { EmptyState } from '@go1d/go1d';

const fakeOnStart = jest.fn();

const setup = (props = {}) => {
  return mount(
    <IntlProvider locale="en">
      <DataFeedEmptyState onStart={fakeOnStart} {...props} />
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
