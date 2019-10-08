import { mount } from 'enzyme';
import * as React from 'react';
import Go1Suspense, { LoadingSpinner } from './index';

it('renders without crashing', () => {
  mount(
      <Go1Suspense fallback="true"><LoadingSpinner /></Go1Suspense>
  );
});
