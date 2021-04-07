import { getFieldsValues, getInitialValues } from './formHelper';

it('Should get correct fields values', () => {
  expect(
    getFieldsValues(
      {
        userId: 'portal.user_id',
      },
      { userId: '2' },
      {
        portal: {
          user_id: '1',
          user_name: 'test_user',
        },
      }
    )
  ).toStrictEqual({
    'portal.user_id': '2',
  });
});

it('Should ignore unchanged fields values', () => {
  expect(
    getFieldsValues(
      {
        userId: 'portal.user_id',
      },
      { userId: '1' },
      {
        portal: {
          user_id: '1',
        },
      }
    )
  ).toStrictEqual({});
});

it('Should get correct initial values', () => {
  expect(
    getInitialValues(
      {
        userId: 'portal.user_id',
      },
      {
        portal: {
          user_id: '1',
          user_name: 'test_user',
        },
      }
    )
  ).toStrictEqual({
    userId: '1',
  });
});
