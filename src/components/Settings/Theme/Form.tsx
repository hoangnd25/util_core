import { Form, NotificationManager, Spinner, SubmitButton, Theme, View } from '@go1d/go1d';
import { FunctionComponent, useContext, useRef, useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import { Formik } from 'formik';
import {
  SETTINGS_THEME_FIELDS_MAPPING,
  SETTINGS_THEME_UPLOAD_FIELDS_MAPPING,
  PREVIEW_IMAGE_TYPE,
  DEFAULT_LANDING_PAGE,
  DEFAULT_LOGO,
} from '@src/constants';
import Track from '@src/utils/tracking';
import { deserializeHtml } from '@src/hooks/useHtmlSlateValue/htmlSerializer';
import SectionBrand from './SectionBrand';
import SectionLogin from './SectionLogin';
import SectionSignup from './SectionSignup';
import { getInitialValues } from './formHelper';
import SectionCertificate from './SectionCertificate';
import SectionDashboard from './SectionDashboard';
import { useThemeSettingsFormHandler } from './Form.hooks';
import { ThemeSettingFormValues, ThemeSettingsFormProps } from './types';
import ConfirmModal from './ConfirmModal';

const ThemeSettingsForm: FunctionComponent<ThemeSettingsFormProps> = (props) => {
  const { portal, user, isSaving } = props;
  const isPartnerPortal = ['content_partner', 'distribution_partner'].includes(portal.type || null);
  const siteName = portal.configuration.site_name;
  const {
    handleSubmit,
    setFeaturedImageCropped,
    featuredImageCropped,
    showConfirmModal,
    setShowConfirmModal,
    setChangesConfirmed,
  } = useThemeSettingsFormHandler(props);

  const theme = useContext(Theme);

  const initialValues = getInitialValues<ThemeSettingFormValues>(
    {
      ...SETTINGS_THEME_UPLOAD_FIELDS_MAPPING,
      ...SETTINGS_THEME_FIELDS_MAPPING,
    },
    portal
  );

  const [themeSettings, setThemeSettings] = useState(initialValues);

  useEffect(() => {
    // Interaction of featuredImage upload i.e crop  and move does not trigger form change event.
    if (featuredImageCropped !== undefined) {
      themeSettings.featuredImage = `${URL.createObjectURL(featuredImageCropped)}`;
    }
  }, [featuredImageCropped, themeSettings]);

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

    if (typeof values[imageType] === 'string' && values[imageType]?.includes('cloudinary')) {
      return values[imageType];
    }

    if (errors?.length > 0) {
      if (imageType === 'featuredImage') {
        values[imageType] = DEFAULT_LANDING_PAGE;
        return values[imageType];
      }
      values[imageType] = DEFAULT_LOGO;
      return values[imageType];
    }

    if (
      typeof values[imageType] === 'string' &&
      (values[imageType].includes(DEFAULT_LANDING_PAGE) || values[imageType].includes(DEFAULT_LOGO))
    ) {
      return values[imageType];
    }

    if (typeof values[imageType] === 'string' && values[imageType].includes('blob')) {
      return values[imageType];
    }

    if (typeof values[imageType] === 'object') {
      return `${URL.createObjectURL(values[imageType])}`;
    }
    return '';
  };

  const handleChange = async (values: { values: ThemeSettingFormValues; errors: ThemeSettingFormValues }) => {
    const newValues = values.values as any;
    const errors = values.errors as any;

    const previewImages = {} as any;
    PREVIEW_IMAGE_TYPE.forEach((key) => {
      previewImages[key] = setPreviewImage(key, newValues, errors);
    });
    const previewValues = { ...newValues, ...previewImages };

    setThemeSettings(previewValues);
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
    Track.trackFS('Button.Portal.Settings.Confirm.Click', { portalId: portal.id, userId: user.id, email: user.mail });
    setChangesConfirmed(true);
    setShowConfirmModal(false);
    formikRef.current?.submitForm();
  };

  return (
    <Form
      formikRef={formikRef}
      initialValues={{
        ...initialValues,
        portalColor: initialValues.portalColor || theme.colors.accent,
        dashboardImageScale: initialValues.dashboardImageScale || 'fixed-width',
        dashboardWelcomeMessage: deserializeHtml(initialValues.dashboardWelcomeMessage || ''),
        featuredImage: initialValues.featuredImage,
        logo: initialValues.logo,
        dashboardIcon: initialValues.dashboardIcon,
      }}
      onSubmit={handleSubmit}
      onChange={debounce((actions) => handleChange(actions))}
    >
      <SectionBrand
        isSaving={isSaving}
        onFeaturedImageCropped={setFeaturedImageCropped}
        isPartnerPortal={isPartnerPortal}
        themeSettings={themeSettings}
        siteName={siteName}
      />
      <SectionLogin isPartnerPortal={isPartnerPortal} themeSettings={themeSettings} siteName={siteName} />
      <SectionSignup isPartnerPortal={isPartnerPortal} themeSettings={themeSettings} siteName={siteName} />
      <SectionDashboard isPartnerPortal={isPartnerPortal} themeSettings={themeSettings} />
      <SectionCertificate isPartnerPortal={isPartnerPortal} />
      <View flexDirection="row">
        <SubmitButton
          disableOnFormError
          color="accent"
          flexDirection="row"
          alignItems="center"
          data-tid="Portal.Settings.Save"
          onClick={() =>
            Track.trackFS('Button.Portal.Settings.Save.Click', {
              portalId: portal.id,
              userId: user.id,
              email: user.mail,
            })
          }
        >
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
