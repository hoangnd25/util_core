import { Form, Spinner, SubmitButton, View } from '@go1d/go1d';
import { FunctionComponent, ReactNode, useState } from 'react';
import { Trans } from '@lingui/macro';
import { FormikConfig } from 'formik';
import { GO1Portal } from '@src/types/user';
import SectionBrand from './SectionBrand';
import SectionLogin from './SectionLogin';
import SectionSignup from './SectionSignup';

export interface FormValues {
  logo?: File | null;
  featuredImage?: File | null;
}

export interface ThemeSettingsFormProps {
  portal?: Partial<GO1Portal>;
  isSaving?: boolean;
  onSave?: (values: unknown) => Promise<void>;
  onUpload?: (image?: File | Blob | null) => Promise<string | undefined>;
  onError?: (message: ReactNode) => void;
}

const ThemeSettingsForm: FunctionComponent<ThemeSettingsFormProps> = props => {
  const { portal, isSaving, onSave, onUpload, onError } = props;
  const [featuredImageCropped, setFeaturedImageCropped] = useState<Blob | undefined>();

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

  const handleSubmit: FormikConfig<FormValues>['onSubmit'] = async (values, actions) => {
    let toSaveObject = {};
    try {
      const [logo, featuredImage] = await Promise.all([
        uploadOrDeleteImage(values.logo),
        uploadOrDeleteImage(values.featuredImage, featuredImageCropped),
      ]);

      toSaveObject = {
        ...toSaveObject,
        ...(logo !== undefined && { 'files.logo': logo }),
        ...(featuredImage !== undefined && { 'files.feature_image': featuredImage }),
      };
    } catch (uploadingError) {
      onError?.(<Trans>Upload image failed</Trans>);
      actions.setSubmitting(false);
      return;
    }

    await onSave?.(toSaveObject);
    actions.setSubmitting(false);
  };

  return (
    <Form
      initialValues={{
        logo: portal?.files?.logo,
        featuredImage: portal?.files?.feature_image, // eslint-disable-line camelcase
      }}
      onSubmit={handleSubmit}
    >
      <SectionBrand isSaving={isSaving} onFeaturedImageCropped={setFeaturedImageCropped} />
      <SectionLogin />
      <SectionSignup />
      <View flexDirection="row">
        <SubmitButton color="accent" flexDirection="row" alignItems="center">
          <View flexDirection="row" alignItems="center">
            {isSaving && <Spinner color="white" marginRight={2} />}
            <Trans>Save</Trans>
          </View>
        </SubmitButton>
      </View>
    </Form>
  );
};

export default ThemeSettingsForm;
