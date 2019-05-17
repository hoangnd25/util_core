import { mount } from 'enzyme';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LinkComponent from './index';

it('renders without crashing', () => {
  mount(
    <BrowserRouter>
      <LinkComponent href="test">Things</LinkComponent>
    </BrowserRouter>
  );
});
