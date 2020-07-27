import * as React from 'react';
import { View, foundations, ToggleSwitch } from '@go1d/go1d';
import withAuth from '@src/components/common/WithAuth';
import withIntegrations from '@src/components/common/WithIntegrations';
import { SIDEBAR_MENUS } from '@src/constants';

export class IntegrationsPage extends React.Component<any,any> {
  public render() {
    const { menu } = this.props;
    return (
      <View>
        {menu.filter(item => item.logo).map(item => (
          <View
            padding={4}
            flexDirection="row"
            justifyContent="space-between"
            border={1}
            borderColor="soft"
            alignItems="center"
            marginY={2}
            borderRadius={2}
            css={{
              ':hover': {
                boxShadow: foundations.shadows.crisp,
              }
            }}
          >
            <View element="img" src={item.logo} height="50px" />
            <ToggleSwitch defaultValue={item.isVisible} size="lg" />
          </View>
        ))}
      </View>
    );
  }
}

export default withAuth(withIntegrations(IntegrationsPage, { active: SIDEBAR_MENUS.ADDONS }));
