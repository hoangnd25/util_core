import * as React from 'react';
import Layout from '@src/components/common/Layout/index';
import { CurrentSessionType } from '@src/types/user';
import { View, Text } from '@go1d/go1d';
import { connect } from 'react-redux';
import { RuntimeSettings } from '@src/types/reducers';
import MenuOptions from './menus';
import  withI18n from '@src/components/common/WithI18n';

interface withApiomPageOptions {
  pageTitle?: React.ReactNode;
  active?: string;
  menuType?: string;
}

interface withApiomCmpProps {
  runtimeSettings: RuntimeSettings;
  currentSession?: CurrentSessionType;
  i18n: any;
}

export const menuOptions = new MenuOptions();
const withApiom = (AppPage, { pageTitle, active, menuType }: withApiomPageOptions) => {
  class WithApiomCmp extends React.PureComponent<withApiomCmpProps, {}> {
    displayName: 'withApiom';

    public render() {
      const {
        runtimeSettings: { embeddedMode = false },
        i18n,
        currentSession,
      } = this.props;

      let menu;
      switch (menuType) {
        case 'Settings':
          menu = menuOptions.getSettingsMenu(i18n);

          break;
        case 'Integrations':
          menu = menuOptions.getIntegrationsMenu(i18n, currentSession.portal);
          break;

        default:
      }

      return (
        <Layout
          withTopNav={!embeddedMode}
          withSideNav={!embeddedMode && { menu, active }}
          wrappingContainer={!embeddedMode}
          containerProps
        >
          {pageTitle && (
            <View marginBottom={5}>
              <Text element="h1" fontSize={4} fontWeight="semibold">
                {pageTitle}
              </Text>
            </View>
          )}
          <View
            backgroundColor="background"
            boxShadow="crisp"
            flexGrow={1}
            borderRadius={2}
            padding={[5, 5, 6]}
            minHeight={embeddedMode ? '200px' : '60vh'}
          >
            <AppPage menu={menu} {...this.props} />
          </View>
        </Layout>
      );
    }
  }
  const mapStateToProps = state => ({
    runtimeSettings: state.runtime,
  });
  return connect(mapStateToProps, null)(withI18n(WithApiomCmp));
};

export default withApiom;
