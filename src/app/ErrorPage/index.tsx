import { ButtonFilled, Container, Icon, Text, View } from '@go1d/go1d';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

const Error = () => (
  <Container contain="full" height={600} justifyContent="center">
    <View flexDirection="row" justifyContent="center">
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
    </View>
    <View flexDirection="row" justifyContent="center" marginTop={2}>
      <ButtonFilled href="/test" color="accent">
        <FormattedMessage id="Click here to go back" defaultMessage="Click here to go back" />
      </ButtonFilled>
    </View>
  </Container>
);

export default Error;
