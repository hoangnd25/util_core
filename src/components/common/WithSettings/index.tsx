import * as React from 'react';
import { Trans, t } from '@lingui/macro';
import { I18n } from '@lingui/react';
import Layout from '@src/components/common/Layout/index';
import { SIDEBAR_MENUS_SETTINGS } from '@src/constants';
import { View, Text } from '@go1d/go1d';
import { connect } from 'react-redux';
import { CurrentSessionType } from '@src/types/user'
import { RuntimeSettings } from '@src/types/reducers'

interface SettingsPageOptions {
  pageTitle?: React.ReactNode;
  active?: string;
}

interface WithSettingsCmpProps {
  runtimeSettings: RuntimeSettings;
  currentSession?: CurrentSessionType; 
}

const WithSettings = (AppPage, { pageTitle, active }: SettingsPageOptions) => {
  class WithSettingsCmp extends React.PureComponent<WithSettingsCmpProps, {}> {
    displayName: 'WithSettings';

    public render() {
      const {
        runtimeSettings: { embeddedMode = false },
      } = this.props;
      return (
        <I18n>
          {({ i18n }) => {
            const menu = this.getMenu(i18n);
            return (
              <Layout
                withTopNav={!embeddedMode}
                withSideNav={!embeddedMode && { menu, active }}
                wrappingContainer={!embeddedMode}
                containerProps
              >
                {pageTitle && (
                  <View marginBottom={6}>
                    <Text element="h1" fontSize={4} fontWeight="semibold">
                      {pageTitle}
                    </Text>
                  </View>
                )}
                <View
                  backgroundColor="background"
                  flexGrow={1}
                  borderRadius={5}
                  padding={[5, 5, 6]}
                  minHeight={embeddedMode ? '200px' : '60vh'}
                >
                  <AppPage menu={menu} {...this.props} />
                </View>
              </Layout>
            );
          }}
        </I18n>
      );
    }

    getMenu = i18n => {
      // Not needed yet but will be needed when we need to know what portal has upgraded in order to show certain features
      // const { currentSession: { portal } } = this.props
      
      return [
        {
          id: SIDEBAR_MENUS_SETTINGS.PORTAL_INFORMATION,
          title: i18n._(t`Portal Information`),
          subtitle: i18n._(t`Portal info, legal and login config`),
          href: 'app/settings/information',
          isApiomLink: true,
          isVisible: true,
        },
        {
          id: SIDEBAR_MENUS_SETTINGS.THEME,
          title: i18n._(t`Theme and Customisation`),
          subtitle: i18n._(t`Brand, message customisation and certificates`),
          href: 'app/settings/theme',
          isApiomLink: false,
          isVisible: true,
          module: 'portal',
        },
        {
          id: SIDEBAR_MENUS_SETTINGS.CONFIGURATION,
          title: i18n._(t`Configuration`),
          subtitle: i18n._(t`Dashboard, menu and other options`),
          href: 'app/settings/configuration',
          isApiomLink: true,
          isVisible: true,
        },
        {
          id: SIDEBAR_MENUS_SETTINGS.RECOMMENDATIONS,
          title: i18n._(t`Recommendations`),
          subtitle: i18n._(t`Improve portal recommendations`),
          href: 'app/settings/recommendations',
          isApiomLink: true,
          isVisible: true,
        },
        {
          id: SIDEBAR_MENUS_SETTINGS.PORTAL_CONTENT_SELECTION,
          title: i18n._(t`Portal Content Selection`),
          subtitle: i18n._(t`Customise available portal content`),
          href: 'app/settings/portal-content-selection',
          isApiomLink: true,
          isVisible: true,
        },
        {
          id: SIDEBAR_MENUS_SETTINGS.NOTIFICATIONS,
          title: i18n._(t`Notifications`),
          subtitle: i18n._(t`In-app messaging and emails`),
          href: 'app/settings/notifications',
          isApiomLink: true,
          isVisible: true,
        },
        {
          id: SIDEBAR_MENUS_SETTINGS.PLAN_AND_BILLING,
          title: i18n._(t`Plan and Billing`),
          subtitle: i18n._(t`Subscription plan and payment details`),
          href: 'app/settings/portal-billing/subscription',
          isApiomLink: true,
          isVisible: true,
        },
        {
          id: SIDEBAR_MENUS_SETTINGS.SETUP_ACCOUNT,
          title: i18n._(t`Setup Portal`),
          subtitle: i18n._(t`Steps to configure your portal`),
          href: 'app/settings/setup-portal',
          isApiomLink: true,
          isVisible: true,
        },
      ];
    };
  }
  const mapStateToProps = state => ({
    runtimeSettings: state.runtime,
  });
  return connect(
    mapStateToProps,
    null
  )(WithSettingsCmp);
};

export default WithSettings;
