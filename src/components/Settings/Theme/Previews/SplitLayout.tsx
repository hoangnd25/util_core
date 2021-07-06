import React from 'react';
import { View, ButtonFilled, Text, Provider, Theme } from '@go1d/go1d';
import IconGo1Logo from '@go1d/go1d/build/components/Icons/Go1Logo';
import { Trans } from '@lingui/macro';
import { DEFAULT_LOGO } from '@src/constants';

interface Props {
  primaryTagline: React.ReactNode;
  description: React.ReactNode;
  logo: File | string | null;
  buttonText: React.ReactNode;
  featuredImage: string;
  terms: React.ReactNode;
  secondaryTagline: React.ReactNode;
  children: React.ReactNode;
  showPolicyLinks: boolean;
  portalColor: string;
}

const SplitLayout: React.FC<Props> = (props) => {
  const {
    primaryTagline,
    secondaryTagline,
    description,
    logo,
    buttonText,
    featuredImage,
    children,
    terms,
    showPolicyLinks,
    portalColor,
  } = props;

  return (
    <Provider accent={portalColor}>
      <Theme.Consumer>
        {({ colors }) => (
          <View width={[0, 800, 850]} height="580px" flexDirection="row" border={1} borderColor="soft">
            <View
              width="50%"
              height="100%"
              borderColor="successLowest"
              backgroundColor="successLowest"
              overflow="hidden"
              css={{
                backgroundImage: `url('${featuredImage}')`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
              }}
            />

            <View width="50%" backgroundColor="faint" height="100%" overflow="auto">
              <View alignItems="center" justifyContent="center" marginTop={8} paddingBottom={4} paddingX={6}>
                {/* LOGOs */}
                {typeof logo === 'string' && logo !== DEFAULT_LOGO ? (
                  <View
                    width="100%"
                    height={128}
                    marginY={5}
                    data-testid="portal-logo"
                    css={{
                      backgroundImage: `url('${logo}')`,
                      backgroundPosition: 'center center',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                ) : (
                  <IconGo1Logo size={8} marginY={6} color="successLowest" />
                )}

                <Text
                  css={{ width: '100%' }} // explicitly set width for IE
                  marginBottom={3}
                  fontSize={3}
                  fontWeight="medium"
                  textAlign="center"
                  color="accent"
                >
                  {primaryTagline}
                </Text>

                <Text marginBottom={5} color="default" textAlign="center">
                  {secondaryTagline[0]}{' '}
                  <Text color="successLowest" fontWeight="medium" textAlign="center" textDecoration="underline">
                    {secondaryTagline[1]}
                  </Text>
                </Text>

                {description && (
                  <View padding={4} borderRadius={3} marginBottom={5} backgroundColor="delicate">
                    <Text color="subtle">{description}</Text>
                  </View>
                )}
                {children}

                <ButtonFilled marginY={4} width="100%" color="accent" css={{ pointerEvents: 'none' }}>
                  {buttonText}
                </ButtonFilled>

                {showPolicyLinks && (
                  <View>
                    <Text textAlign="center">
                      {terms}{' '}
                      <Trans>
                        <Text color="successLowest" fontWeight="bold" textDecoration="underline">
                          Terms of Use
                        </Text>{' '}
                        and{' '}
                        <Text color="successLowest" fontWeight="bold" textDecoration="underline">
                          Privacy Policy.
                        </Text>
                      </Trans>
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </Theme.Consumer>
    </Provider>
  );
};

export default SplitLayout;
