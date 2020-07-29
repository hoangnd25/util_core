import { mount } from 'enzyme';
import * as React from 'react';
import { View } from '@go1d/go1d';
import withIntegrations from '.';

/** TEST SETUP * */
let Component;

class App extends React.Component {
  render = () => <View />
}

const setup = ({ pageTitle = 'Example', active = 'microsoft-azure' }) => {
  Component = withIntegrations(App, {
    pageTitle,
    active
  });
  return mount(<Component />);
};

/** TEST SETUP END * */

it('renders correctly', done => {
  const wrapper = setup({}) as any;
  setImmediate(() => {
    wrapper.update();
    expect(wrapper.find("Layout").length).toBe(1);
    expect(wrapper.find("h1").text()).toBe('Example');
    done();
  });
});
