import {
  DEFAULT_LANDING_PAGE,
  DEFAULT_LOGO,
  PREVIEW_IMAGE_TYPE,
  SETTINGS_THEME_CUSTOMIZATION_GROUPS_MAPPING,
} from '@src/constants';
import _get from 'lodash/get';
import { FormApplyCustomizationValues } from './types';

type ValueMap =
  | string
  | {
      readPath: string;
      savePath: string;
    };

export const getFieldsValues = <T extends {}>(
  mapping: Partial<Record<keyof T, ValueMap>>,
  formValues: T,
  initialValues?: object
): Partial<T> => {
  return Object.keys(mapping).reduce((carry, fieldName) => {
    const fieldMapping: ValueMap = mapping[fieldName] || null;
    const fieldValue = formValues[fieldName];
    if (!fieldMapping || typeof fieldValue !== 'string') {
      return carry;
    }

    const portalFieldValue = _get(
      initialValues,
      typeof fieldMapping === 'string' ? fieldMapping : fieldMapping.readPath
    );
    return {
      ...carry,
      ...(fieldValue !== portalFieldValue && {
        [typeof fieldMapping === 'string' ? fieldMapping : fieldMapping.savePath]: fieldValue,
      }),
    };
  }, {});
};

export const setInitialImages = (value, apiomImage, defaultImage) => {
  if (
    // If they have that issue where there is no theme settings saved against the portal
    !value ||
    value.length < 0 ||
    // if image is not an empty string
    // If the user has the old apiom imageset
    value === apiomImage ||
    // If the defaultImage is already set
    value === defaultImage
    // If error return matches the imageType
  ) {
    return defaultImage;
  } if (typeof value === 'string' && value.includes('cloudinary')) {
    // if they have already uploaded an image or have created their preview image then show that.
    return value;
  } return defaultImage;
};

export const getInitialValues = <T>(
  mapping: Partial<Record<keyof T, ValueMap>>,
  initialValues: object
): Partial<Record<keyof T, string>> => {
  return Object.keys(mapping).reduce((carry, fieldName) => {
    const fieldMapping: ValueMap = mapping[fieldName] || null;
    if (!fieldMapping) {
      return carry;
    }

    let value = _get(initialValues, typeof fieldMapping === 'string' ? fieldMapping : fieldMapping.readPath);

    switch (fieldName) {
      case 'logo':
      case 'dashboardIcon':
        value = setInitialImages(fieldName, 'logo-white', DEFAULT_LOGO);
        break;
      case 'featuredImage':
        value = setInitialImages(fieldName, 'getting-started', DEFAULT_LANDING_PAGE);
        break;
      default:
    }

    if (typeof value !== 'string') {
      return carry;
    }

    return {
      ...carry,
      ...(value !== undefined && { [fieldName]: value }),
    };
  }, {} as T);
};

export const getCustomizationGroupsFromValues = (values: FormApplyCustomizationValues) =>
  Object.entries(values).reduce<string[]>((carry, [key, value]) => {
    if (Object.keys(SETTINGS_THEME_CUSTOMIZATION_GROUPS_MAPPING).includes(key) && value === true) {
      return [...carry, SETTINGS_THEME_CUSTOMIZATION_GROUPS_MAPPING[key]];
    }
    return carry;
  }, []);
