import { mount } from 'enzyme';
import * as React from 'react';
import LinkComponent from './index';
import { getBaseUrl } from "@src/config";

it('renders without crashing', () => {
  mount(
      <LinkComponent href="test">Things</LinkComponent>
  );
});

it('renders internal link', () => {
  mount(
    <LinkComponent href={`${getBaseUrl( )}/examples/protectedRoute`}>Things</LinkComponent>
  );
});

it('renders external link without crashing', () => {
  mount(
    <LinkComponent href="http://test.com">Things</LinkComponent>
  );
});
