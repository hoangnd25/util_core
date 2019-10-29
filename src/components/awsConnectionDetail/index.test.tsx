import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { AWSConnectionDetail } from './index';

const fakeCredentials = {
  awsBucketUrl: 's3://cd22d769e7d5.credential.name',
  awsAccessKeyId: 'cd22d769e7d5',
  awsSecretKey: 'd4db524a-ca36-480f-b228-cd22d769e7d5',
};
const intlMock = {
  formatMessage: jest.fn(),
};

const setup = (props: any) => {
  return mount(
    <IntlProvider locale="en">
      <AWSConnectionDetail {...props} />
    </IntlProvider>
  );
};

it('renders without crashing', () => {
  setup({
    awsCredential: fakeCredentials,
    intl: intlMock,
  });
});

it('renders correct copy state', () => {
  const ComponentWrapper = setup({
    awsCredential: fakeCredentials,
    intl: intlMock,
  });
  const Element = ComponentWrapper.find(AWSConnectionDetail);

  expect(Element.state('copied')).toBeFalsy();
  (Element.instance() as any).onCopyToClipboard(true);
  expect(Element.state('copied')).toBeTruthy();
});
