import { Text, View } from '@go1d/go1d';
import { FunctionComponent } from 'react';

interface Props {
  title: React.ReactNode;
  actionButton?: React.ReactNode;
}

const SettingsFormSection: FunctionComponent<Props> = ({ title, actionButton, children }) => {
  return (
    <View marginBottom={7}>
      <View marginBottom={5} flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text element="h1" fontSize={3} fontWeight="semibold" paddingRight={3}>
          {title}
        </Text>
        {actionButton}
      </View>
      {children}
    </View>
  );
};

export default SettingsFormSection;
