import MockAdapter from 'axios-mock-adapter';
import createHttpInstance from '@src/utils/http';
import dataFeedService, { MappingData } from '.';

let mock: MockAdapter;
const http = createHttpInstance();
const awsFakeConnection = {
  aws_bucket_url: 's3://cd22d769e7d5.credential.name',
  aws_created_date: '2019-10-30T05:50:06+00:00',
  aws_access_key_id: 'cd22d769e7d5',
  aws_secret_access_key: 'd4db524a-ca36-480f-b228-cd22d769e7d5',
};

beforeEach(() => mock = new MockAdapter(http));
afterEach(() => mock.reset());

test('should fetch mapping fields', async () => {
  const fakeGo1Fields = {
    mail: {
      label: 'mail',
      type: 'string',
      enum: [],
      mandatory: '1',
      published: '1',
      weight: "74",
    },
    first_name: {
      label: 'first name',
      type: 'string',
      enum: [],
      mandatory: '1',
      published: '1'
    },
    last_name: {
      label: 'last name',
      type: 'string',
      enum: [],
      mandatory: '1',
      published: '1'
    },
    status: {
      label: 'status',
      type: 'integer',
      enum: [0, 1, 2],
      mandatory: '',
      published: '0'
    },
  };
  const fakeMappings = {
    mail: 'Email',
    first_name: 'First Name',
    last_name: 'Last Name',
    status: '',
  };

  mock.onGet('/user-feed/fields/123/account').reply(200, fakeGo1Fields);
  mock.onGet('/user-feed/mapping/123').reply(200, { mappings: fakeMappings });

  const service = dataFeedService(http);
  const actual = await service.fetchMappingFields(123);
  const expected = {
    externalId: 'mail',
    go1Fields: [{
      label: 'email',
      mappedField: 'Email',
      name: 'mail',
      options: [],
      published: true,
      required: true,
      type: 'string',
      weight: "74",
    }, {
      label: 'first name',
      mappedField: 'First Name',
      name: 'first_name',
      options: [],
      published: true,
      required: true,
      type: 'string',
      weight: "0",
    }, {
      label: 'last name',
      mappedField: 'Last Name',
      name: 'last_name',
      options: [],
      published: true,
      required: true,
      type: 'string',
      weight: "0",
    }],
  };

  expect(actual).toEqual(expected);
});

test('should send correct payload & url to create mapping', () => {
  spyOn(http, 'put');

  const service = dataFeedService(http);
  const fakeMappingPayload = {
    type: 'account',
    external_id: 'mail',
    mappings: {},
    rows: [],
  } as any;

  service.createMapping(fakeMappingPayload, 123);
  expect(http.put).toHaveBeenCalledWith('/user-feed/mapping/123', fakeMappingPayload);
});

test('should fetch mapping data', async () => {
  const assertFetchMapping = async (mockResponse: any, expected: MappingData) => {
    mock.onGet('/user-feed/mapping/123').reply(200, {
      ...mockResponse,
    });

    const service = dataFeedService(http);
    const mappingData = await service.fetchMappingData(123);
    expect(mappingData).toEqual({
      ...expected,
    });
  };

  const fakeMappings = {
    mail: 'Email',
    first_name: 'First Name',
    last_name: 'Last Name',
    status: '',
  };

  await assertFetchMapping(
    {
      mappings: fakeMappings,
      updated: 123456789,
      author: {
        first_name: 'Testing',
        last_name: 'User',
      },
    },
    {
      mappings: fakeMappings,
      updated: 123456789000,
      author: {
        fullName: 'Testing User',
      },
    }
  );

  await assertFetchMapping(
    {
      mappings: fakeMappings,
      updated: 123456789,
      author: {
        first_name: 'Testing',
        last_name: 'User',
      },
      external_id: 'mail',
    },
    {
      mappings: fakeMappings,
      updated: 123456789000,
      author: {
        fullName: 'Testing User',
      },
      externalId: 'mail',
    }
  );
});

test('should fetch AWS connection detail', async () => {
  mock.onPost('/user-feed/connection/123').reply(200, awsFakeConnection);

  const service = dataFeedService(http);
  const actual = await service.createAWSCredentials(123);

  const expected = {
    isNew: true,
    awsBucketUrl: 's3://cd22d769e7d5.credential.name',
    awsCreatedDate: '2019-10-30T05:50:06+00:00',
    awsAccessKeyId: 'cd22d769e7d5',
    awsSecretKey: 'd4db524a-ca36-480f-b228-cd22d769e7d5',
  };
  expect(actual).toEqual(expected);
});

test('should format AWS connection detail', async () => {
  mock.onGet('/user-feed/connection/123').reply(200, awsFakeConnection);

  const service = dataFeedService(http);
  const actual = await service.fetchAWSCredentials(123);
  const expected = {
    isNew: false,
    awsBucketUrl: 's3://cd22d769e7d5.credential.name',
    awsCreatedDate: '2019-10-30T05:50:06+00:00',
    awsAccessKeyId: 'cd22d769e7d5',
    awsSecretKey: 'd4db524a-ca36-480f-b228-cd22d769e7d5',
  };

  expect(actual).toEqual(expected);
});
