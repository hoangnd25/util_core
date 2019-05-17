import { mount } from 'enzyme';
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Go1Suspense from './index';

it('renders without crashing', () => {
  mount(
    <BrowserRouter>
      <Go1Suspense fallback={'true'}>Things</Go1Suspense>
    </BrowserRouter>
  );
});
