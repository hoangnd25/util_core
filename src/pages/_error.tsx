import * as React from 'react';
import { Container, Icon, Text, View } from '@go1d/go1d';
import { FormattedMessage } from 'react-intl';


function Error({ statusCode }) {
  return (
    <Container contain="full" height={600} justifyContent="center">
      <View flexDirection="row" justifyContent="center">
        {statusCode ? (
          <Text color="default" fontSize={6} fontWeight="semibold" lineHeight="paragraph">
            {statusCode}
          </Text>
        ) : (
          <>
            <Text color="default" fontSize={6} fontWeight="semibold" lineHeight="paragraph">
              <FormattedMessage id="Uh oh, that's a no" defaultMessage="Uh oh, that's a no" />
            </Text>
            <Icon
              name="Go1Logo"
              color="default"
              size={6}
              style={{
                marginTop: '17px',
              }}
              marginLeft={3}
            />
          </>
        )}
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
  return {currentSession: {}, statusCode };
};

export default Error;
