import { getFieldsValues, getInitialValues, stripTabsAndNewLines } from './formHelper';

const portal = {
  user_id: '1',
  user_name: 'test_user',
};

const simpleMapping = {
  userId: 'portal.user_id',
};

const customMapping = {
  userId: { readPath: 'portal.user_id', savePath: 'portal_user_id' },
};

it('Should get correct fields values', () => {
  expect(getFieldsValues(simpleMapping, { userId: '2' }, { portal })).toStrictEqual({
    'portal.user_id': '2',
  });

  expect(getFieldsValues(customMapping, { userId: '2' }, { portal })).toStrictEqual({ portal_user_id: '2' });
});

it('Should ignore unchanged fields values', () => {
  expect(getFieldsValues(simpleMapping, { userId: '1' }, { portal })).toStrictEqual({});
  expect(getFieldsValues(customMapping, { userId: '1' }, { portal })).toStrictEqual({});
});

it('Should get correct initial values', () => {
  expect(getInitialValues(simpleMapping, { portal })).toStrictEqual({
    userId: '1',
  });

  expect(getInitialValues(customMapping, { portal })).toStrictEqual({
    userId: '1',
  });
});

it('Should strip tabs & newlines for html content', () => {
  expect(
    stripTabsAndNewLines(`
<p>Test tag:</p>

<ul>
	<li><strong>Tab indent <a href="http://go1.com">GO1</a></li>
</ul>

<p>Another tag.</p>
    `)
  ).toStrictEqual('<p>Test tag:</p><ul><li><strong>Tab indent <a href="http://go1.com">GO1</a></li></ul><p>Another tag.</p>');
});
