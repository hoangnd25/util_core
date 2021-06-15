import { Form, NotificationManager, Spinner, SubmitButton, Theme, View } from '@go1d/go1d';
import { FunctionComponent, useContext, useRef, useState } from 'react';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import { SETTINGS_THEME_FIELDS_MAPPING, SETTINGS_THEME_UPLOAD_FIELDS_MAPPING } from '@src/constants';
import SectionBrand from './SectionBrand';
import SectionLogin from './SectionLogin';
import SectionSignup from './SectionSignup';
import { getInitialValues } from './formHelper';
import SectionCertificate from './SectionCertificate';
import SectionDashboard from './SectionDashboard';
import { deserializeHtml } from './htmlSerializer';
import { useThemeSettingsFormHandler } from './Form.hooks';
import { FormValues, ThemeSettingsFormProps } from './types';
import ConfirmModal from './ConfirmModal';

const ThemeSettingsForm: FunctionComponent<ThemeSettingsFormProps> = (props) => {
  const { portal, isSaving } = props;
  const isPartnerPortal = ['content_partner', 'distribution_partner'].includes(portal.type || null);
  const { handleSubmit, setFeaturedImageCropped, showConfirmModal, setShowConfirmModal, setChangesConfirmed } =
    useThemeSettingsFormHandler(props);

  const theme = useContext(Theme);
  const initialValues = getInitialValues<FormValues>(
    {
      ...SETTINGS_THEME_UPLOAD_FIELDS_MAPPING,
      ...SETTINGS_THEME_FIELDS_MAPPING,
    },
    portal
  );

  const [themeSettings, setThemeSettings] = useState(initialValues);

  const formikRef = useRef<Formik>(null);

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const setPreviewImage = (imageType, values, errors) => {
    // if image is  not an empty string after being deleted and it is
    // check the image is set in the values -> if haven't been set before will not be in default values object
    // Check that the featured image is not an already saved cloudinary image file
    // Check that the image has not bee removed which defaults to empty string
    // Check if errors is present by the returned error message -> then create blob image object

    if (values[imageType].length > 0 && values[imageType].includes('cloudinary')) {
      return values[imageType];
    }
    if (errors && errors.length > 0) {
      return undefined;
    }
    return `${URL.createObjectURL(values[imageType])}`;
  };

  const handleChange = async (values: { values: FormValues; errors: FormValues }) => {
    const newValues = values.values as any;
    const errors = values.errors as any;
    const images = ['featuredImage', 'logo'];
    const previewImages = {};
    images.forEach((key) => {
      previewImages[key] = setPreviewImage(key, newValues, errors);
    });

    const previewValues = [newValues].map((item, i) => ({ ...item, ...previewImages }));
    setThemeSettings(previewValues[0] as any);
  };

  const handleConfirmModalClose = () => {
    setChangesConfirmed(false);
    setShowConfirmModal(false);
    NotificationManager.warning({
      message: <Trans>Changes have not been saved.</Trans>,
      options: {
        lifetime: 3000,
        isOpen: true,
      },
    });
  };

  const handleConfirmChanges = () => {
    setChangesConfirmed(true);
    setShowConfirmModal(false);
    formikRef.current?.submitForm(); // eslint-disable-line no-unused-expressions
  };

  return (
    <Form
      formikRef={formikRef}
      initialValues={{
        ...initialValues,
        portalColor: initialValues.portalColor || theme.colors.accent,
        dashboardImageScale: initialValues.dashboardImageScale || 'fixed-width',
        dashboardWelcomeMessage: deserializeHtml(initialValues.dashboardWelcomeMessage || ''),
      }}
      onSubmit={handleSubmit}
      onChange={debounce((actions) => handleChange(actions))}
    >
      <SectionBrand
        isSaving={isSaving}
        onFeaturedImageCropped={setFeaturedImageCropped}
        isPartnerPortal={isPartnerPortal}
        themeSettings={themeSettings}
      />
      <SectionLogin isPartnerPortal={isPartnerPortal} themeSettings={themeSettings} />
      <SectionSignup isPartnerPortal={isPartnerPortal} themeSettings={themeSettings} />
      <SectionDashboard isPartnerPortal={isPartnerPortal} />
      <SectionCertificate isPartnerPortal={isPartnerPortal} />
      <View flexDirection="row">
        <SubmitButton disableOnFormError color="accent" flexDirection="row" alignItems="center">
          <View flexDirection="row" alignItems="center">
            {isSaving && <Spinner color="white" marginRight={2} />}
            <Trans>Save changes</Trans>
          </View>
        </SubmitButton>
      </View>
      <ConfirmModal
        isOpen={showConfirmModal}
        onRequestClose={handleConfirmModalClose}
        onConfirm={handleConfirmChanges}
        portalInstance={portal.title}
      />
    </Form>
  );
};

export default ThemeSettingsForm;
