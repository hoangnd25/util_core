import _get from 'lodash/get';

export const getFieldsValues = <T extends {}>(
  mapping: Partial<Record<keyof T, string>>,
  formValues: T,
  initialValues?: object
): Partial<T> => {
  return Object.entries(mapping).reduce((carry, [fieldName, fieldMapping]) => {
    const fieldValue = formValues[fieldName];
    if (typeof fieldMapping !== 'string' || typeof fieldValue !== 'string') {
      return carry;
    }

    const portalFieldValue = _get(initialValues, fieldMapping);
    return {
      ...carry,
      ...(fieldValue !== portalFieldValue && { [fieldMapping]: fieldValue }),
    };
  }, {});
};

export const getInitialValues = <T extends {}>(
  mapping: Partial<Record<keyof T, string>>,
  initialValues: object
): Partial<Record<keyof T, string>> => {
  return Object.entries(mapping).reduce((carry, [fieldName, fieldMapping]) => {
    if (typeof fieldMapping !== 'string') {
      return carry;
    }

    const value = _get(initialValues, fieldMapping);

    if (typeof value !== 'string') {
      return carry;
    }

    return {
      ...carry,
      ...(value !== undefined && { [fieldName]: value }),
    };
  }, {} as T);
};
