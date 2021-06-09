import { Text, View } from '@go1d/go1d';
import { Trans } from '@lingui/macro';

export const ImageSupportText = () => (
  <View alignItems="center" textAlign="center">
    <Text marginTop={3} marginBottom={2} paddingX={4} fontSize={[1, 1]}>
      <Trans>JPG, PNG, and GIF are supported</Trans>
    </Text>
    <Text paddingX={2} fontSize={[1, 1]}>
      <Trans>Max file size is 5MB</Trans>
    </Text>
  </View>
);
