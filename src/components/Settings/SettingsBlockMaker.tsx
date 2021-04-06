import { FunctionComponent } from 'react';
import { Text, View, ViewProps } from '@go1d/go1d';

interface BlockMakerProps extends ViewProps {
  title: React.ReactNode;
  description: React.ReactNode;
}

const SettingsBlockMaker: FunctionComponent<BlockMakerProps> = ({ title, description, children, ...props }) => {
  return (
    <View {...props}>
      <Text element="h2" fontSize={2} fontWeight="medium" marginBottom={3}>
        {title}
      </Text>

      <Text marginBottom={3} color="subtle">
        {description}
      </Text>

      {children}
    </View>
  );
};

export default SettingsBlockMaker;
