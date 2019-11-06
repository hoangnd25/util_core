import { mount } from 'enzyme';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { AWSConnectionDetail } from './index';
import * as clipboardUtil from '../../utils/clipboard';

const fakeCredentials = {
  awsBucketUrl: 's3://cd22d769e7d5.credential.name',
  awsAccessKeyId: 'cd22d769e7d5',
  awsSecretKey: 'd4db524a-ca36-480f-b228-cd22d769e7d5',
};
const intlMock = {
  formatMessage: jest.fn(),
};

const setup = (props?: any) => {
  spyOn(clipboardUtil, 'copyToClipboard');

  return mount(
    <IntlProvider locale="en">
      <AWSConnectionDetail intl={intlMock} awsCredential={fakeCredentials} {...props} />
    </IntlProvider>
  );
};

it('Should render without crashing', () => {
  setup();
});

it('Should render correct copy state', () => {
  const ComponentWrapper = setup();
  const Element = ComponentWrapper.find(AWSConnectionDetail);

  expect(Element.state('copied')).toBeFalsy();
  (Element.instance() as any).onCopyToClipboard(true);
  expect(Element.state('copied')).toBeTruthy();
});

it('Should show all fields', () => {
  const ComponentWrapper = setup();
  const fieldBucketUrl = ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldBucketUrl"]');
  const fieldAccessKeyId = ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldAccessKeyId"]');
  const fieldSecretKey = ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldSecretKey"]');

  expect(fieldBucketUrl).not.toBeNull();
  expect(fieldAccessKeyId).not.toBeNull();
  expect(fieldSecretKey).not.toBeNull();
});

it('Should able to show/hide all fields', () => {
  const ComponentWrapper = setup({ expandable: true });

  const toggleButton = ComponentWrapper.find('View[data-testid="awsConnectionDetail.toggleButton"]');
  const fieldBucketUrl = ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldBucketUrl"]');

  // All connection fields are invisible by default
  expect(fieldBucketUrl).toHaveLength(0);
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldBucketUrl"]').find('CopyToClipboard')).toHaveLength(0);
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldBucketUrl"]').find('Tooltip')).toHaveLength(0);
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldAccessKeyId"]')).toHaveLength(0);
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldSecretKey"]')).toHaveLength(0);

  // Should able to expand connection detail
  toggleButton.simulate('click');
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldBucketUrl"]')).toHaveLength(1);
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldBucketUrl"]').find('CopyToClipboard')).toHaveLength(1);
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldBucketUrl"]').find('Tooltip')).toHaveLength(0);
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldAccessKeyId"]')).toHaveLength(1);
  expect(ComponentWrapper.find('View[data-testid="awsConnectionDetail.fieldSecretKey"]')).toHaveLength(1);
});
