import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import Error from './index';

it('renders without crashing', () => {
  mount(
    <IntlProvider locale="en">
      <Error />
    </IntlProvider>
  );
});
