import React from 'react';
import { mount } from 'enzyme';
import CopyToClipboard from '.';

const mockFn = jest.fn();

jest.mock('copy-to-clipboard', () => {
  return jest.fn();
});

const setup = (props) => {
  return mount(
    <CopyToClipboard {...props} />
  );
};

it('renders without crashing', () => {
  setup({ text: 'Text to copy' });
});

it('should call callback', () => {
  const Component = setup({
    text: 'Text to copy',
    onCopy: mockFn,
  });
  Component.find('View').simulate('click');
  expect(mockFn).toHaveBeenCalled();
});
