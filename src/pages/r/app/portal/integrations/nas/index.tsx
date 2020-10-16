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
        faded: '#CDE2E7',
      },
    };

    return (
      <Provider theme={theme as any}>
        <View flexDirection="column" minHeight="40vh">
          <View justifyContent="center" borderBottom={1} borderColor="faded">
            <Text fontSize={4} fontWeight="semibold" color="N900" textAlign="center">
              Mas
            </Text>
            <Text textAlign="center" color="subtle" paddingBottom={4}>
              Use the generated developer credentials to complete the integration.
            </Text>
          </View>

          <View flexDirection="column" width="100%" justifyContent="center" paddingTop={6}>
            <CopyTextInput fieldName="Portal name" fieldValue={currentSession.portal.title} />
            <CopyTextInput fieldName="Username" fieldValue="adp-admin@go1.com" />
            <CopyTextInput fieldName="Password" fieldValue="+BravoEchoIndiaLima:" />
          </View>
        </View>
      </Provider>
    );
  }
}

Nas.contextType = AppContext;
export default withAuth(withIntegrations(Nas, { active: SIDEBAR_MENUS.NAS }));
