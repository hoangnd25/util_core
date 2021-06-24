import { SETTINGS_THEME_CUSTOMIZATION_GROUPS_MAPPING } from '@src/constants';
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

export const getInitialValues = <T>(
  mapping: Partial<Record<keyof T, ValueMap>>,
  initialValues: object
): Partial<Record<keyof T, string>> => {
  return Object.keys(mapping).reduce((carry, fieldName) => {
    const fieldMapping: ValueMap = mapping[fieldName] || null;
    if (!fieldMapping) {
      return carry;
    }

    const value = _get(initialValues, typeof fieldMapping === 'string' ? fieldMapping : fieldMapping.readPath);

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
