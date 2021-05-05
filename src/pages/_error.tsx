import * as React from 'react';
import { Container, Text, View, Link } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import { getConfigValue } from '@src/config';

function Error() {
  return (
    <Container height="100vh" justifyContent="center" flexDirection="column" backgroundColor="dangerHigh">
      <View
        backgroundColor="dangerHigh"
        flexDirection={['column', 'row', 'row']}
        contain="normal"
        alignItems="center"
        justifyContent="center"
      >
        <View paddingX={[2, 2, 6]} maxWidth={['100%', '50%', '50%']}>
          <View textAlign="center">
            <Text fontSize={6} fontWeight="semibold" lineHeight="display" fontFamily="serif" color="successLowest">
              <Trans>Uh oh </Trans>
              <br />
              <Trans>that&apos;s a no-go zone</Trans>
            </Text>
          </View>
          <View textAlign="center" paddingY={5} paddingX={4}>
            <Text fontSize={3} lineHeight="paragraph" textAlign="center" color="successLowest">
              <Trans>We can’t seem to find the page you’re looking for.</Trans>
              <br />
              <Trans>Try going</Trans>{' '}
              <Link href={`https://${getConfigValue('WEBSITE_URL')}`}>
                <Text color="dangerMid" fontSize={3}>
                  <Trans>home</Trans>
                </Text>
              </Link>
              <Trans>, or </Trans>{' '}
              <Link href={`https://${getConfigValue('WEBSITE_URL')}/contact-us`}>
                <Text color="dangerMid" fontSize={3}>
                  <Trans>contact us</Trans>
                </Text>
              </Link>{' '}
              <Trans>for help.</Trans>
            </Text>
          </View>
        </View>
        <View paddingX={6} maxWidth={['100%', '50%', '50%']}>
          <img
            alt="Go1_404"
            src="https://images.prismic.io/go1development/e4a00695-2517-4548-b8d9-28ad7610038c_404.png?auto=compress,format"
          />
        </View>
      </View>
    </Container>
  );
}

export default Error;
