import React, { useState, FunctionComponent } from 'react';
import { Checkbox, Field, TextInput, View } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import PreviewButton from '@src/components/Settings/Theme/PreviewButton';
import AuthPreview from '@src/components/Settings/Theme/AuthPreview';
import getConfig from 'next/config';
import { ThemeSettingFormValues } from './types';
import SignupForm from './Previews/SignupForm';

const {
  publicRuntimeConfig: { CDN_PATH },
} = getConfig();

interface Props {
  isPartnerPortal?: boolean;
  themeSettings?: ThemeSettingFormValues;
  siteName?: string;
}

const SectionSignup: FunctionComponent<Props> = ({ isPartnerPortal, themeSettings, siteName }) => {
  const { logo, featuredImage, signupTitle, signupDescription, portalColor } = themeSettings;
  const [openPreview, setOpenPreview] = useState(false);

  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize sign up</Trans>}
          actionButton={
            <PreviewButton onClick={() => setOpenPreview(true)}>
              <Trans>Preview sign up</Trans>
            </PreviewButton>
          }
        >
          <AuthPreview
            isOpen={openPreview}
            onRequestClose={() => setOpenPreview(false)}
            title={i18n._(t`sign up`)}
            buttonText={i18n._(t`Create new account`)}
            primaryTagline={signupTitle || 'Sign up with your work email '}
            terms={<Trans>By creating an account you are agreeing to {siteName || 'the Go1'}&rsquo;s</Trans>}
            secondaryTagline={[i18n._(t`Already have an account?`), i18n._(t`Log in`)]}
            description={signupDescription}
            featuredImage={`url("${featuredImage}")`}
            logo={logo}
            showPolicyLinks
            portalColor={portalColor}
          >
            <SignupForm />
          </AuthPreview>

          <View marginBottom={5}>
            <Field name="signupTitle" label={i18n._(t`Sign up title`)} component={TextInput} hideStatus />
          </View>

          <View marginBottom={5}>
            <Field name="signupDescription" label={i18n._(t`Sign up description`)} component={TextInput} hideStatus />
          </View>

          {isPartnerPortal && (
            <View>
              <Field
                name="applyCustomizationSignup"
                label={i18n._(t`Apply sign up customization to customer portals`)}
                description={i18n._(t`This can be changed from the individual portal’s settings page`)}
                hideStatus
                component={Checkbox}
                hideLabel
              />
            </View>
          )}
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionSignup;
