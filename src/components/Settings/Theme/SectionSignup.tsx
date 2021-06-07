import React, { useState } from 'react';
import { Checkbox, Field, TextInput, View  } from '@go1d/go1d';
import { t, Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import SettingsFormSection from '@src/components/Settings/SettingsFormSection';
import { FunctionComponent } from 'react';
import PreviewButton from '@src/components/Settings/Theme/PreviewButton';
import Preview from '@src/components/Settings/Theme/Preview';
import IconEye from '@go1d/go1d/build/components/Icons/Eye';
import { FormValues } from '@src/components/Settings/Theme/Form';

import getConfig from 'next/config';

const {
  publicRuntimeConfig: { CDN_PATH },
} = getConfig();

interface Props {
  isPartnerPortal?: boolean;
  themeSettings?: FormValues;
}

const SectionSignup: FunctionComponent<Props> = ({ isPartnerPortal, themeSettings }) => {
  const { logo, featuredImage, signupTitle, signupDescription } = themeSettings;
  const [openPreview, setOpenPreview] = useState(false);


  const landingPage = typeof featuredImage === 'string' && featuredImage?.includes('cloudinary') ? `url("${featuredImage}")` : `url("${CDN_PATH}/signup_default_landing_page.jpg")`;
  
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
          <Preview 
            isOpen={openPreview} 
            onRequestClose={() => setOpenPreview(false)} 
            title={i18n._(t`sign up`)}
            buttonText={i18n._(t`Create new account`)}
            primaryTagline={signupTitle || 'Sign up with your work email '}
            terms={i18n._(t`By creating an account you are agreeing to the Go1`)}
            secondaryTagline={[i18n._(t`Already have an account?`), i18n._(t`Log in`)]}
            description={signupDescription}
            featuredImage={landingPage}
            logo={logo}>       
            <View>
              <View flexDirection="row" display="flex" marginY={3} justifyContent="space-between" width="100%">
                <View paddingRight={1} flexShrink={1} flexGrow={1}>
                  <TextInput id="firstName" label={i18n._(t`First Name`)} placeHolder="First Name" css={{ pointerEvents: 'none' }}></TextInput>
                </View>
                <View paddingLeft={1} flexShrink={1} flexGrow={1}>
                  <TextInput id="lastName" label={i18n._(t`Last Name`)} autoComplete="new-password" placeHolder="Last Name" css={{ pointerEvents: 'none' }}></TextInput>
                </View>
              </View>
              <View width="100%">
                <TextInput id="Email" placeHolder="Email" autoComplete="new-password" css={{ pointerEvents: 'none' }}></TextInput>
              </View>
              <View marginY={3} width="100%">
                <TextInput id="Password" placeHolder="Password" autoComplete="new-password" css={{ pointerEvents: 'none' }} suffixNode={<View padding={4}><IconEye color="accent"/></View>}></TextInput>
              </View>
            </View>
          </Preview>

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
                hideLabel={true}
              />
            </View>
          )}
        </SettingsFormSection>
      )}
    </I18n>
  );
};

export default SectionSignup;
