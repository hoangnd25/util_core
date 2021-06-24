import { Trans } from '@lingui/macro';
import { FormikConfig } from 'formik';
import React, { useState } from 'react';
import {
  SETTINGS_THEME_FIELDS_MAPPING,
  SETTINGS_THEME_UPLOAD_FIELDS_MAPPING,
  SETTINGS_THEME_CUSTOMIZATION_GROUPS_MAPPING,
} from '@src/constants';
import { serializeHtml } from '@src/hooks/useHtmlSlateValue/htmlSerializer';
import { ThemeSettingFormValues, FormApplyCustomizationValues, ThemeSettingsFormProps } from './types';
import { getCustomizationGroupsFromValues, getFieldsValues } from './formHelper';
import { ApplyCustomizationdError, FormSaveError, ImageUploadError } from './errors';

export const useThemeSettingsFormHandler = (props: ThemeSettingsFormProps) => {
  const { portal, onSave, onUpload, onError } = props;
  const [featuredImageCropped, setFeaturedImageCropped] = useState<Blob | undefined>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [changesConfirmed, setChangesConfirmed] = useState(false);

  const uploadOrDeleteImage = async (
    image?: string | File | null,
    croppedImage?: File | Blob
  ): Promise<string | null | undefined> => {
    if (!image) {
      return null; // image deleted, set the field to null
    }

    if (image instanceof File) {
      return onUpload(croppedImage || image); // upload then return uploaded url
    }

    if (typeof image === 'string' && croppedImage) {
      return onUpload(croppedImage); // image not changed but cropped, upload cropped image then return uploaded url
    }

    return undefined; // return undefined to skip updating this field
  };

  const handleSubmit: FormikConfig<ThemeSettingFormValues & FormApplyCustomizationValues>['onSubmit'] = async (
    values,
    actions
  ) => {
    const applyCustomizationGroups = getCustomizationGroupsFromValues(values);
    if (applyCustomizationGroups.length > 0 && !changesConfirmed) {
      setShowConfirmModal(true);
      actions.setSubmitting(false);
      return;
    }

    try {
      const [logo, signatureImage, featuredImage, dashboardImage, dashboardIcon] = await Promise.all([
        uploadOrDeleteImage(values.logo),
        uploadOrDeleteImage(values.signatureImage),
        uploadOrDeleteImage(values.featuredImage, featuredImageCropped),
        uploadOrDeleteImage(values.dashboardImage),
        uploadOrDeleteImage(values.dashboardIcon),
      ]);

      const toSaveObject = {
        ...(logo !== undefined && { [SETTINGS_THEME_UPLOAD_FIELDS_MAPPING.logo]: logo }),
        ...(signatureImage !== undefined && { [SETTINGS_THEME_UPLOAD_FIELDS_MAPPING.signatureImage]: signatureImage }),
        ...(featuredImage !== undefined && { [SETTINGS_THEME_UPLOAD_FIELDS_MAPPING.featuredImage]: featuredImage }),
        ...(dashboardImage !== undefined && { [SETTINGS_THEME_UPLOAD_FIELDS_MAPPING.dashboardImage]: dashboardImage }),
        ...(dashboardIcon !== undefined && { [SETTINGS_THEME_UPLOAD_FIELDS_MAPPING.dashboardIcon]: dashboardIcon }),
        ...getFieldsValues(
          { ...SETTINGS_THEME_FIELDS_MAPPING },
          {
            ...values,
            dashboardWelcomeMessage: serializeHtml(
              typeof values.dashboardWelcomeMessage !== 'string' && values.dashboardWelcomeMessage
            ),
          },
          portal
        ),
      };

      if (featuredImage) {
        actions.setFieldValue('featuredImage', featuredImage);
      }

      await onSave(toSaveObject, applyCustomizationGroups);
      setChangesConfirmed(false);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }

      if (error instanceof ImageUploadError) {
        onError?.(<Trans>An unexpected error has occurred while uploading image. Please try again.</Trans>);
      }

      if (error instanceof ApplyCustomizationdError) {
        onError?.(
          <Trans>
            An unexpected error has occurred while applying customization to customer portals. Please try again.
          </Trans>
        );
      }

      if (error instanceof FormSaveError) {
        onError?.(<Trans>An unexpected error has occurred while saving form. Please try again.</Trans>);
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return {
    handleSubmit,
    featuredImageCropped,
    setFeaturedImageCropped,
    showConfirmModal,
    setShowConfirmModal,
    changesConfirmed,
    setChangesConfirmed,
  };
};

export default useThemeSettingsFormHandler;
