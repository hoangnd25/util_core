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

const ThemeSettingsForm: FunctionComponent<ThemeSettingsFormProps> = props => {
  const { portal, isSaving } = props;
  const isPartnerPortal = ['content_partner', 'distribution_partner'].includes(portal.type || null);
  const {
    handleSubmit,
    setFeaturedImageCropped,
    showConfirmModal,
    setShowConfirmModal,
    applyCustomizationGroups,
    setChangesConfirmed,
  } = useThemeSettingsFormHandler(props);

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

  const handleChange = (values: { values: any }) => {
    setThemeSettings(values.values);
  };

  const handleConfirmModalClose = () => {
    setChangesConfirmed(false);
    setShowConfirmModal(false);
    NotificationManager.warning({
      message: <Trans>Changes have not been saved.</Trans>,
      options: {
        lifetime: 3000,
        isOpen: true, },
    });
  };

  const handleConfirmChanges = () => {
    setChangesConfirmed(true);
    setShowConfirmModal(false);
    formikRef.current?.submitForm();
  }

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
      onChange={handleChange}
    >
      <SectionBrand
        isSaving={isSaving}
        onFeaturedImageCropped={setFeaturedImageCropped}
        isPartnerPortal={isPartnerPortal}
      />
      <SectionLogin isPartnerPortal={isPartnerPortal} />
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
        applyCustomizationGroups={applyCustomizationGroups}
      />
    </Form>
  );
};

export default ThemeSettingsForm;
