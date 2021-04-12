import _get from 'lodash/get';

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
