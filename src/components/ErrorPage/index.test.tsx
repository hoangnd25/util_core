import { mount } from 'enzyme';
import React from 'react';
import ErrorPage from './index';

it('Renders without crashing', () => {
  mount(<ErrorPage error={'Test Error'} />);
});
