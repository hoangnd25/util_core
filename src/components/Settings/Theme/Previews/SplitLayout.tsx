import React from 'react';
import { View, ButtonFilled, Text } from '@go1d/go1d';
import IconGo1Logo from '@go1d/go1d/build/components/Icons/Go1Logo';
import { Trans } from '@lingui/macro';

interface Props {
  primaryTagline, description, logo, buttonText, featuredImage, terms: string;
  secondaryTagline: string[];
  children: React.ReactNode, 
}

const SplitLayout: React.FC<Props> = (props) => {
  const { primaryTagline, secondaryTagline, description, logo, buttonText, featuredImage, children, terms } = props;

  const DEFAULT_APIOM_LOGO = 'images/logo-white.png';
  
  return (
      <View width="100%" height="580px" flexDirection="row" border={1} borderColor="soft">
        <View
          width="400px"
          height="100%"
          borderColor="successLowest"
          backgroundColor="successLowest"
          overflow="hidden"
          css={{
            backgroundImage: featuredImage,
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
                marginY={5}
                data-testid="portal-logo"
                css={{
                  backgroundImage: `url(${logo})`,
                  backgroundPosition: 'center center',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                }}
              ></View>
            )) || <IconGo1Logo size={8} marginY={6} color="successLowest" />}


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
              {secondaryTagline[0]}{' '}
              <Text color="successLowest" fontWeight="medium" textAlign="center">
              {secondaryTagline[1]} 
              </Text>
            </Text>
       
            <View padding={4} borderRadius={3} marginBottom={5} backgroundColor="delicate">
              <Text color="subtle">{description}</Text>
            </View>

            <View zIndex={'modalBackdrop'}>
              {children}
          
              <ButtonFilled marginY={4} width="100%" color="accent">
                {buttonText}
              </ButtonFilled>

              {/* Overlay to prevent usage of form */}
                <View backgroundColor="none" height={578} width={300} position="absolute" css={{ bottom: '10%' }} zIndex={'modal'} overflow="auto"/>
            </View>
                  
            <Text textAlign="center">
              {terms} 
              <Text color="successLowest" fontWeight="bold" textDecoration="underline">
              {' '}
                <Trans>Go1 terms of use</Trans>
              </Text>
              {' '}
                <Trans>and</Trans>
              {' '}
              <Text color="successLowest" fontWeight="bold" textDecoration="underline">
                <Trans>privacy policy.</Trans>
              </Text>
            </Text>

          </View> 
        </View>
      </View>
  );
};

export default SplitLayout;
