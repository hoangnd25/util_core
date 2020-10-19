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

export class Mas extends React.Component<Props, any> {
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

Mas.contextType = AppContext;
export default withAuth(withIntegrations(Mas, { active: SIDEBAR_MENUS.MAS }));
