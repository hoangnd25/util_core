import * as React from 'react';
import { Container, Text, View } from '@go1d/go1d';
import { Trans } from '@lingui/macro';
import IconGo1Logo from '@go1d/go1d/build/components/Icons/Go1Logo';

function Error({ statusCode }) {
  return (
    <Container contain="full" height={600} justifyContent="center">
      <View flexDirection="column" alignItems="center">
        {statusCode && (
          <Text color="default" fontSize={6} fontWeight="semibold" lineHeight="paragraph">
            {statusCode}
          </Text>
        )}
        <View marginTop={5} flexDirection="row">
          <Text color="default" fontSize={6} fontWeight="semibold" lineHeight="paragraph">
            <Trans>Uh oh, that&apos;s a no</Trans>
          </Text>
          <IconGo1Logo
            color="default"
            size={9}
            marginLeft={3}
          />
        </View>
      </View>
    </Container>
  );
}

Error.getInitialProps = ({ res, err }) => {
  let statusCode = 404;
  if (res) {
    statusCode = res.statusCode;
  } else if (err) {
    statusCode = err.statusCode;
  }
  return { currentSession: {}, statusCode };
};

export default Error;
