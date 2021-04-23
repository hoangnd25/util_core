import { Form, Spinner, SubmitButton, Theme, View } from '@go1d/go1d';
import { FunctionComponent, ReactNode, useContext, useState } from 'react';
import { Trans } from '@lingui/macro';
import { FormikConfig } from 'formik';
import { GO1Portal } from '@src/types/user';
import SectionBrand from './SectionBrand';
import SectionLogin from './SectionLogin';
import SectionSignup from './SectionSignup';
import { getFieldsValues, getInitialValues } from './formHelper';
import SectionCertificate from './SectionCertificate';

export interface FormValues {
  logo?: File | null;
  featuredImage?: File | null;
  loginTitle?: string;
  loginDescription?: string;
  signupTitle?: string;
  signupDescription?: string;
  portalColor?: string;
  signatureImage?: File | null;
  signatureName?: string;
  signatureTitle?: string;
}

export interface ThemeSettingsFormProps {
  portal: GO1Portal;
  isSaving?: boolean;
  onSave: (values: object) => Promise<void>;
  onUpload: (image?: File | Blob | null) => Promise<string | undefined>;
  onError?: (message: ReactNode) => void;
}

const BRANDS_FIELDS_MAPPING = {
  loginTitle: 'configuration.login_tagline',
  loginDescription: 'configuration.login_secondary_tagline',
  signupTitle: 'configuration.signup_tagline',
  signupDescription: 'configuration.signup_secondary_tagline',
  portalColor: { readPath: 'data.theme.primary', savePath: 'theme.primary' },
  signatureTitle: 'configuration.signature_title',
  signatureName: 'configuration.signature_name',
};

const UPLOAD_FIELDS_MAPPING = {
  logo: 'files.logo',
  featuredImage: 'files.login_background',
  signatureImage: 'configuration.signature_image'
};

export const useThemeSettingsFormHandler = (props: ThemeSettingsFormProps) => {
  const { portal, onSave, onUpload, onError } = props;
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
      const [logo, signatureImage, featuredImage] = await Promise.all([
        uploadOrDeleteImage(values.logo),
        uploadOrDeleteImage(values.signatureImage),
        uploadOrDeleteImage(values.featuredImage, featuredImageCropped),
      ]);

      const toSaveObject = {
        ...(logo !== undefined && { [UPLOAD_FIELDS_MAPPING.logo]: logo }),
        ...(signatureImage !== undefined && { [UPLOAD_FIELDS_MAPPING.signatureImage]: signatureImage }),
        ...(featuredImage !== undefined && { [UPLOAD_FIELDS_MAPPING.featuredImage]: featuredImage }),
        ...getFieldsValues({ ...BRANDS_FIELDS_MAPPING }, values, portal),
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

  return {
    handleSubmit,
    featuredImageCropped,
    setFeaturedImageCropped,
  };
};

const ThemeSettingsForm: FunctionComponent<ThemeSettingsFormProps> = props => {
  const { portal, isSaving } = props;
  const { handleSubmit, setFeaturedImageCropped } = useThemeSettingsFormHandler(props);

  const theme = useContext(Theme);
  const initialValues = getInitialValues<FormValues>(
    {
      ...UPLOAD_FIELDS_MAPPING,
      ...BRANDS_FIELDS_MAPPING,
    },
    portal
  )

  return (
    <Form
      initialValues={{
        ...initialValues,
        portalColor: initialValues.portalColor || theme.colors.accent
      }}
      onSubmit={handleSubmit}
    >
      <SectionBrand isSaving={isSaving} onFeaturedImageCropped={setFeaturedImageCropped} />
      <SectionLogin />
      <SectionSignup />
      <SectionCertificate />

      <View flexDirection="row">
        <SubmitButton color="accent" flexDirection="row" alignItems="center">
          <View flexDirection="row" alignItems="center">
            {isSaving && <Spinner color="white" marginRight={2} />}
            <Trans>Save changes</Trans>
          </View>
        </SubmitButton>
      </View>
    </Form>
  );
};

export default ThemeSettingsForm;
