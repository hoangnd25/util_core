import { SETTINGS_THEME_UPLOAD_FIELDS_MAPPING, DEFAULT_LOGO, DEFAULT_LANDING_PAGE } from '@src/constants';
import { getFieldsValues, getInitialValues } from './formHelper';

const portal = {
  user_id: '1',
  user_name: 'test_user',
};

const portalWithApiomImages = {
  logo: '/logo-white.jpg',
  featuredImage: '/getting-started.jpg',
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

it('If portal has default Apiom images or no images, set to Default theme images', () => {
  expect(getInitialValues(SETTINGS_THEME_UPLOAD_FIELDS_MAPPING, { portalWithApiomImages })).toEqual({
    dashboardIcon: DEFAULT_LOGO,
    featuredImage: DEFAULT_LANDING_PAGE,
    logo: DEFAULT_LOGO,
  });
});
