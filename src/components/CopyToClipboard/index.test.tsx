import React from 'react';
import { mount } from 'enzyme';
import * as clipboardUtil from '../../utils/clipboard';
import CopyToClipboard from './index';

const mockFn = jest.fn();

const setup = (props) => {
  return mount(
    <CopyToClipboard {...props} />
  );
};

it('renders without crashing', () => {
  setup({ text: 'Text to copy' });
});

it('should call callback', () => {
  spyOn(clipboardUtil, 'copyToClipboard');

  const Component = setup({
    text: 'Text to copy',
    onCopy: mockFn,
  });
  Component.find('View').simulate('click');
  expect(mockFn).toHaveBeenCalled();
});
