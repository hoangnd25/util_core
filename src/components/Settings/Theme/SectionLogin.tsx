import { Checkbox, Field, TextInput, View, Text } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import React, { FunctionComponent, useState } from 'react';
import { I18n } from '@lingui/react';
import Preview from '@src/components/Settings/Theme/Preview';
import PreviewButton from '@src/components/Settings/Theme/PreviewButton';
import getConfig from 'next/config';
import IconEye from '@go1d/go1d/build/components/Icons/Eye';
import { FormValues } from './types';

const {
  publicRuntimeConfig: { CDN_PATH },
} = getConfig();

interface Props {
  isPartnerPortal?: boolean;
  themeSettings?: FormValues;
}

const SectionLogin: FunctionComponent<Props> = ({ isPartnerPortal, themeSettings }) => {
  const { logo, featuredImage, loginTitle, loginDescription } = themeSettings;
  const [openPreview, setOpenPreview] = useState(false);
  const landingPage =
    typeof featuredImage === 'string' && featuredImage?.includes('cloudinary')
      ? `url("${featuredImage}")`
      : `url("${CDN_PATH}/login_default_landing_page.jpg")`;

  return (
    <I18n>
      {({ i18n }) => (
        <SettingsFormSection
          title={<Trans>Customize login</Trans>}
          actionButton={
            <PreviewButton onClick={() => setOpenPreview(true)}>
              <Trans>Preview login</Trans>
            </PreviewButton>
          }
        >
          <Preview
            isOpen={openPreview}
            onRequestClose={() => setOpenPreview(false)}
            title={i18n._(t`login`)}
            buttonText={i18n._(t`Log in`)}
            primaryTagline={loginTitle || 'Log in to Go1'}
            terms=""
            secondaryTagline={[i18n._(t`Don't have an account?`), i18n._(t`Sign up`)]}
            description={loginDescription}
            featuredImage={landingPage}
            logo={logo}
            isShown
          >
            <View width="100%">
              <View width="100%">
                <TextInput id="Email" placeHolder="Email" css={{ pointerEvents: 'none' }} autoComplete="password" />
              </View>
              <View marginY={3} width="100%">
                <TextInput
                  id="Password"
                  placeHolder="Password"
                  css={{ pointerEvents: 'none' }}
                  autoComplete="new-password"
                  suffixNode={
                    <View padding={4}>
                      <IconEye color="accent" />
                    </View>
                  }
                 />
              </View>
              <Text color="accent" textDecoration="underline" fontWeight="bold">
                Forgot your password?
              </Text>
            </View>
          </Preview>

          <View marginBottom={5}>
            <Field name="loginTitle" label={i18n._(t`Login title`)} component={TextInput} hideStatus />
          </View>
          <View marginBottom={5}>
            <Field name="loginDescription" label={i18n._(t`Login description`)} component={TextInput} hideStatus />
          </View>
          {isPartnerPortal && (
            <View>
              <Field
                name="applyCustomizationLogin"
                label={i18n._(t`Apply login customization to customer portals`)}
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

export default SectionLogin;
