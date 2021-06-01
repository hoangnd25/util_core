import { Form, Spinner, SubmitButton, Theme, View } from '@go1d/go1d';
import { FunctionComponent, ReactNode, useContext } from 'react';
import { Trans } from '@lingui/macro';
import { Value as SlateValue } from 'slate';
import { GO1Portal } from '@src/types/user';
import SectionBrand from './SectionBrand';
import SectionLogin from './SectionLogin';
import SectionSignup from './SectionSignup';
import { getInitialValues } from './formHelper';
import SectionCertificate from './SectionCertificate';
import SectionDashboard from './SectionDashboard';
import { deserializeHtml } from './htmlSerializer';
import { useThemeSettingsFormHandler } from './Form.hooks';
import { SETTINGS_THEME_FIELDS_MAPPING, SETTINGS_THEME_UPLOAD_FIELDS_MAPPING } from '@src/constants';

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
  dashboardWelcomeMessage?: SlateValue;
  dashboardImageScale?: string;
  dashboardImage?: File | null;
  dashboardIcon?: File | null;
}

export interface FormApplyCustomizationValues {
  applyCustomizationLogo?: boolean;
  applyCustomizationPortalColor?: boolean;
  applyCustomizationFeaturedImage?: boolean;
  applyCustomizationCertificate?: boolean;
  applyCustomizationDashboard?: boolean;
  applyCustomizationLogin?: boolean;
  applyCustomizationSignup?: boolean;
}

export interface ThemeSettingsFormProps {
  portal: GO1Portal;
  isSaving?: boolean;
  onSave: (values: object, childCustomizationGroups?: string[]) => Promise<void>;
  onUpload: (image?: File | Blob | null) => Promise<string | undefined>;
  onError?: (message: ReactNode) => void;
}

const ThemeSettingsForm: FunctionComponent<ThemeSettingsFormProps> = props => {
  const { portal, isSaving } = props;
  const isPartnerPortal = ['content_partner', 'distribution_partner'].includes(portal.portalData?.type || null);
  const { handleSubmit, setFeaturedImageCropped } = useThemeSettingsFormHandler(props);

  const theme = useContext(Theme);
  const initialValues = getInitialValues<FormValues>(
    {
      ...SETTINGS_THEME_UPLOAD_FIELDS_MAPPING,
      ...SETTINGS_THEME_FIELDS_MAPPING,
    },
    portal
  );

  return (
    <Form
      initialValues={{
        ...initialValues,
        portalColor: initialValues.portalColor || theme.colors.accent,
        dashboardImageScale: initialValues.dashboardImageScale || 'fixed-width',
        dashboardWelcomeMessage: deserializeHtml(initialValues.dashboardWelcomeMessage || ''),
      }}
      onSubmit={handleSubmit}
    >
      <SectionBrand isSaving={isSaving} onFeaturedImageCropped={setFeaturedImageCropped} isPartnerPortal={isPartnerPortal} />
      <SectionLogin isPartnerPortal={isPartnerPortal} />
      <SectionSignup isPartnerPortal={isPartnerPortal} />
      <SectionDashboard isPartnerPortal={isPartnerPortal} />
      <SectionCertificate isPartnerPortal={isPartnerPortal} />
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
