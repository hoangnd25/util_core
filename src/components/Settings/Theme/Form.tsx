import { Form, Spinner, SubmitButton, View } from '@go1d/go1d';
import { FunctionComponent, ReactNode, useState } from 'react';
import { Trans } from '@lingui/macro';
import { FormikConfig } from 'formik';
import { GO1Portal } from '@src/types/user';
import SectionBrand from './SectionBrand';
import SectionLogin from './SectionLogin';
import SectionSignup from './SectionSignup';
import { getFieldsValues, getInitialValues } from './formHelper';

export interface FormValues {
  logo?: File | null;
  featuredImage?: File | null;
  loginTitle?: string;
  loginDescription?: string;
  signupTitle?: string;
  signupDescription?: string;
}

export interface ThemeSettingsFormProps {
  portal: GO1Portal;
  isSaving?: boolean;
  onSave: (values: object) => Promise<void>;
  onUpload: (image?: File | Blob | null) => Promise<string | undefined>;
  onError?: (message: ReactNode) => void;
}

const LOGIN_SIGNUP_FIELDS_MAPPING = {
  loginTitle: 'configuration.login_tagline',
  loginDescription: 'configuration.login_secondary_tagline',
  signupTitle: 'configuration.signup_tagline',
  signupDescription: 'configuration.signup_secondary_tagline',
};

const UPLOAD_FIELDS_MAPPING = {
  logo: 'files.logo',
  featuredImage: 'files.login_background',
};

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
    try {
      const [logo, featuredImage] = await Promise.all([
        uploadOrDeleteImage(values.logo),
        uploadOrDeleteImage(values.featuredImage, featuredImageCropped),
      ]);

      const toSaveObject = {
        ...(logo !== undefined && { [UPLOAD_FIELDS_MAPPING[logo]]: logo }),
        ...(featuredImage !== undefined && { [UPLOAD_FIELDS_MAPPING[featuredImage]]: featuredImage }),
        ...getFieldsValues(LOGIN_SIGNUP_FIELDS_MAPPING, values, portal),
      };

      if (featuredImage) {
        actions.setFieldValue('featuredImage', featuredImage);
      }

      await onSave(toSaveObject);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
      onError?.(<Trans>Upload image failed</Trans>);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Form
      initialValues={getInitialValues(
        {
          ...UPLOAD_FIELDS_MAPPING,
          ...LOGIN_SIGNUP_FIELDS_MAPPING,
        },
        portal
      )}
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
