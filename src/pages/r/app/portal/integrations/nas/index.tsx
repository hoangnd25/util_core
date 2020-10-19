import * as React from 'react';
import { View, Text, Provider } from '@go1d/go1d';
import { colors } from '@go1d/go1d/build/foundations';
import { CurrentSessionType } from '@src/types/user';
import { SIDEBAR_MENUS } from '@src/constants';
import withAuth from '@src/components/common/WithAuth';
import withIntegrations from '@src/components/common/WithIntegrations';
import AppContext from '@src/utils/appContext';
import CopyTextInput from '@src/components/common/CopyTextInput';

interface Props {
  currentSession: CurrentSessionType;
}

export class Nas extends React.Component<Props, any> {
  state = {
    copied: false,
  };

  render() {
    const { currentSession } = this.props;
    const theme = {
      colors: {
        ...colors,
        accent: '#1A778F',
      },
    };

    return (
      <Provider theme={theme as any}>
       <View flexDirection="column" minHeight="40vh" paddingTop={4}>
          <Text color="subtle">Use the generated credentials to complete the integration.</Text>
          <View flexDirection="row" width="100%" justifyContent="space-between" paddingTop={3}>
            <View width="48%">
              <CopyTextInput fieldName="Username" fieldValue="adp-admin@go1.com" />
            </View>
            <View width="48%">
              <CopyTextInput fieldName="Password" fieldValue="+BravoEchoIndiaLima:" />
            </View>
          </View>
          <CopyTextInput fieldName="Portal name" fieldValue={currentSession.portal.title} />
        </View>
      </Provider>
    );
  }
}

Nas.contextType = AppContext;
export default withAuth(withIntegrations(Nas, { active: SIDEBAR_MENUS.NAS }));
