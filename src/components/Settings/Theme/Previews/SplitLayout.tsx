import React from 'react';
import getConfig from 'next/config';
import { View, ButtonFilled, Text, TextInput, PasswordInput, foundations, Provider } from '@go1d/go1d';


import IconGo1Logo from '@go1d/go1d/build/components/Icons/Go1Logo';
const {
  publicRuntimeConfig: { CDN_PATH },
} = getConfig();

const SplitLayout = props => {
  const { previewType, themeSettings } = props;
  const { logo, signupTitle, signupDescription, featuredImage } = themeSettings;

  const backgroundCheck = themeSettings.featuredImage?.includes('cloudinary');

  const DEFAULT_APIOM_LOGO = 'images/logo-white.png';

  let primaryTagline, secondaryTagline, link, landingPage, buttonText, termsAgreement;

  switch(previewType) {
    case 'sign up':
      primaryTagline = signupTitle || 'Sign up with your work email';
      secondaryTagline = 'Already have an account? ';
      link = 'Log in';
      landingPage = backgroundCheck ? `url("${featuredImage}")` :  `url("${CDN_PATH}/signup_default_landing_page.png")`;
      buttonText = 'Create new account';
      termsAgreement = 'By signing up';

      case 'log in':
  }
  
  return (
    <Provider accent={foundations.colors.accent}>
      <View width="100%" height="570px" flexDirection="row" border={1} borderColor="soft">
        <View
          width="400px"
          height="100%"
          borderColor="successLowest"
          backgroundColor="successLowest"
          overflow="hidden"
          css={{
            backgroundImage: landingPage,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        ></View>

        <View width="400px" backgroundColor="faint" height="100%" overflow="auto">
          <View alignItems="center" justifyContent="center" width={'100%'} marginTop={8} paddingX={6}>
            {/* LOGOs */}
            {(logo && logo !== DEFAULT_APIOM_LOGO && (
              <View
                width="100%"
                height={128}
                marginY={6}
                data-testid="portal-logo"
                css={{
                  backgroundImage: `url(${logo})`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }}
              ></View>
            )) || <IconGo1Logo size={8} marginY={6} color="successLowest" />}

            {/* TITLE */}

            <Text
              css={{ width: '100%' }} // explicitly set width for IE
              marginBottom={3}
              fontSize={3}
              fontWeight="medium"
              textAlign="center"
              color="successLowest"
            >
              {primaryTagline}
            </Text>
            <Text marginBottom={5} color="default" textAlign="center">
              {secondaryTagline}{' '}
              <Text color="successLowest" fontWeight="medium" textAlign="center">
                {link}
              </Text>
            </Text>
            <View padding={4} borderRadius={3} marginBottom={5} backgroundColor="delicate">
              <Text color="subtle">{signupDescription}</Text>
            </View>

            {previewType === 'sign up' && (
              <View>
                <View flexDirection="row" display="flex" marginY={3} justifyContent="space-between" width="100%">
                  <View paddingRight={1} flexShrink={1} flexGrow={1}>
                    <TextInput id="firstName" label="First name" floating></TextInput>
                  </View>
                  <View paddingLeft={1} flexShrink={1} flexGrow={1}>
                    <TextInput id="lastName" label="Last name" floating></TextInput>
                  </View>
                </View>

                <View width="100%">
                  <TextInput id="email" label="Email" floating></TextInput>
                </View>
                <View marginY={3} width="100%">
                  <PasswordInput id="password" label="Password" floating></PasswordInput>
                </View>
              </View>
              )}

            <ButtonFilled marginY={4} width="100%" color="accent">
              {buttonText}
            </ButtonFilled>      
            <Text textAlign="center">
                {termsAgreement}, you agree to the{' '}
              <Text color="successLowest" fontWeight="bold" textDecoration="underline">
                Go1 terms of use
              </Text>{' '}
                and{' '}
              <Text color="successLowest" fontWeight="bold" textDecoration="underline">
                privacy policy.
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </Provider>
  );
};

export default SplitLayout;
