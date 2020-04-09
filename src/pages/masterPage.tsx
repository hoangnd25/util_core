import * as React from 'react';
import { connect } from "react-redux";
import { View, Text, foundations } from '@go1d/go1d';
import Layout from '@src/components/common/Layout';
import SIDEBAR_MENUS from "@src/constants/sidebarMenu";
import { defineMessagesList, getSidebarTexts } from "@src/utils/translation";
import { PortalModel } from '@go1d/go1d-exchange';
import SidebarMenus from "@src/components/SidebarMenus";

export interface MasterPageProps {
  intl: any;
  scrollToTop: () => void;
}

export interface MasterPageOptions {
  parentPage: string;
  childPage: string;
}

export const withMasterPage = (Component: any, options: MasterPageOptions): any => {
  class MasterPage extends React.Component<any, any> {
    pageContentRef: any;

    constructor(props) {
      super(props);
      this.pageContentRef = React.createRef();
    }

    scrollToTop() {
      if (this.pageContentRef && this.pageContentRef.scrollIntoView) {
        this.pageContentRef.scrollIntoView();
      }
    }

    getString(searchKey: string, intl?: any): string {
      const string = getSidebarTexts()[searchKey];
      if (!intl) {
        return string;
      }
      return intl.formatMessage(string);
    }

    getSidebarMenus(intl?: any) {
      const { currentSession, featureToggles } = this.props;
      const portal = new PortalModel(currentSession.portal || {});
      const allIntegrations = (portal && portal.configuration && portal.configuration.integrations) || {};
      const { parentPage } = options;

      const enabledIntegrations = {} as any;
      Object.getOwnPropertyNames(allIntegrations).forEach(name => {
        enabledIntegrations[name] = !!allIntegrations[name].status;
      });

      if (parentPage === 'integration') {
        return [
          {
            id: SIDEBAR_MENUS.ADDONS,
            title: this.getString(SIDEBAR_MENUS.ADDONS, intl),
            href: 'app/integrations/addons',
            isApiomLink: true,
            isVisible: true,
          },
          {
            id: SIDEBAR_MENUS.SCORM,
            title: this.getString(featureToggles.xAPI ? SIDEBAR_MENUS.SCORM_AND_XAPI : SIDEBAR_MENUS.SCORM, intl),
            href: featureToggles.xAPI ? '/integrations/scorm-and-xapi' : 'app/integrations/addon/scorm',
            isApiomLink: !featureToggles.xAPI,
            isVisible: !!enabledIntegrations.scorm,
            module: featureToggles.xAPI ? 'portal' : undefined,
          },
          {
            id: SIDEBAR_MENUS.AUTOPILOT,
            title: this.getString(SIDEBAR_MENUS.AUTOPILOT, intl),
            href: 'app/integrations/addon/autopilot',
            isApiomLink: true,
            isVisible: !!enabledIntegrations.autopilot,
          },
          {
            id: SIDEBAR_MENUS.STRIPE,
            title: this.getString(SIDEBAR_MENUS.STRIPE, intl),
            href: 'app/integrations/addon/stripe',
            isApiomLink: true,
            isVisible: !!enabledIntegrations.stripe,
          },
          {
            id: SIDEBAR_MENUS.ZAPIER,
            title: this.getString(SIDEBAR_MENUS.ZAPIER, intl),
            href: 'app/integrations/addon/zapier',
            isApiomLink: true,
            isVisible: !!enabledIntegrations.zapier,
          },
          {
            id: SIDEBAR_MENUS.LTI_PROVIDER,
            title: this.getString(SIDEBAR_MENUS.LTI_PROVIDER, intl),
            href: 'app/integrations/addon/ltiprovider',
            isApiomLink: true,
            isVisible: !!enabledIntegrations.ltiprovider,
          },
          {
            id: SIDEBAR_MENUS.VETTRAK,
            title: this.getString(SIDEBAR_MENUS.VETTRAK, intl),
            href: 'app/integrations/addon/vettrak',
            isApiomLink: true,
            isVisible: !!enabledIntegrations.vettrak,
          },
          {
            id: SIDEBAR_MENUS.WISENET,
            title: this.getString(SIDEBAR_MENUS.WISENET, intl),
            href: 'app/integrations/addon/wisenet',
            isApiomLink: true,
            isVisible: !!(enabledIntegrations.wisenet && featureToggles.wisenet),
          },
          {
            id: SIDEBAR_MENUS.XERO,
            title: this.getString(SIDEBAR_MENUS.XERO, intl),
            href: 'app/integrations/addon/xero',
            isApiomLink: true,
            isVisible: !!(enabledIntegrations.xero && featureToggles.xero),
          },
          {
            id: SIDEBAR_MENUS.SUCCESS_FACTORS,
            title: this.getString(SIDEBAR_MENUS.SUCCESS_FACTORS, intl),
            href: 'app/integrations/addon/successfactors',
            isApiomLink: true,
            isVisible: !!enabledIntegrations.successfactors,
          },
          {
            id: SIDEBAR_MENUS.ORACLE,
            title: this.getString(SIDEBAR_MENUS.ORACLE, intl),
            href: '/integrations/oracle',
            isApiomLink: false,
            isVisible: !!enabledIntegrations.oracle,
            module: 'portal',
          },
          {
            id: SIDEBAR_MENUS.MICROSOFT_AZURE,
            title: this.getString(SIDEBAR_MENUS.MICROSOFT_AZURE, intl),
            href: 'app/integrations/addon/azure',
            isApiomLink: true,
            isVisible: !!enabledIntegrations.azure,
          },
          {
            id: SIDEBAR_MENUS.COURSE_CATALOG,
            title: this.getString(SIDEBAR_MENUS.COURSE_CATALOG, intl),
            href: 'app/integrations/embed',
            isApiomLink: true,
            isVisible: true,
          },
          {
            id: SIDEBAR_MENUS.SINGLE_SIGN_ON,
            title: this.getString(SIDEBAR_MENUS.SINGLE_SIGN_ON, intl),
            href: featureToggles.cs_tool ? 'app/integrations/sso-saml' : 'app/integrations/sso',
            isApiomLink: true,
            isVisible: true,
          },
          {
            id: SIDEBAR_MENUS.DEVELOPER,
            title: this.getString(SIDEBAR_MENUS.DEVELOPER, intl),
            href: 'app/integrations/developer',
            isApiomLink: true,
            isVisible: true,
          },
          {
            id: SIDEBAR_MENUS.USER_DATA_FEED,
            title: this.getString(SIDEBAR_MENUS.USER_DATA_FEED, intl),
            href: '/integrations/user-data-feed',
            isApiomLink: false,
            isVisible: !!featureToggles['user-data-feed'],
            module: 'portal',
          },

          
        ];
      }
      return [];
    }

    getPageOptions() {
      return {
        title: true,
        sidebar: true,
        body: true,
      };
    }

    getPageTitle() {
      const { intl } = this.props;
      const { childPage } = options;
      const mapping = {
        'user-data-feed': defineMessagesList().integrationUserDataFeedPageTitle,
        'scorm-and-xapi': defineMessagesList().integrationScormAndXApiTitle,
        'oracle': defineMessagesList().integrationOracle,
      };
      return intl.formatMessage(mapping[childPage] || defineMessagesList().integrationDefaultTitle);
    }

    getActiveMenu(): string {
      const { childPage } = options;
      const mapping = {
        'user-data-feed': SIDEBAR_MENUS.USER_DATA_FEED,
        'scorm-and-xapi': SIDEBAR_MENUS.SCORM,
        'oracle': SIDEBAR_MENUS.ORACLE,
      };
      return mapping[childPage] || '';
    }

    render() {
      const pageTitle = this.getPageTitle();
      const { title: hasTitle, sidebar: hasSidebar, body: hasBody } = this.getPageOptions();
      const { intl } = this.props;
      const sidebarMenus = this.getSidebarMenus(intl);
      const sidebarTitle = intl.formatMessage(defineMessagesList().integrationSidebarTitle);

      return (
        <View backgroundColor="faint" minHeight="100vh" innerRef={element => {this.pageContentRef = element;}}>
          <Layout
            title={pageTitle}
            wrappingContainer
            withTopNav
            containerProps={{
              justifyContent: 'initial',
            }}
          >
            <View css={{
              [foundations.breakpoints.md]: {
                flexDirection: 'row',
                paddingBottom: foundations.spacing[6],
                paddingTop: foundations.spacing[6],
              },
            }}>
              {hasSidebar && (
                <View
                  marginBottom={5}
                  css={{
                    [foundations.breakpoints.md]: {
                      marginRight: foundations.spacing[5],
                      width: 220,
                    },
                  }}
                >
                  <>
                    <View marginBottom={3}>
                      <Text element="h3" fontWeight="semibold" fontSize={3}>{sidebarTitle}</Text>
                    </View>

                    <SidebarMenus
                      active={this.getActiveMenu()}
                      menus={sidebarMenus}
                    />
                  </>
                </View>
              )}
              {(hasTitle || hasBody) && (
                <View flexGrow={1} flexShrink={1}>
                  {hasTitle && (
                    <View marginBottom={5}>
                      <Text element="h1" fontSize={4} fontWeight="semibold">{pageTitle}</Text>
                    </View>
                  )}

                  {hasBody && (
                    <View
                      backgroundColor="background"
                      boxShadow="crisp"
                      paddingX={4}
                      paddingY={5}
                      borderRadius={2}
                      css={{
                        [foundations.breakpoints.md]: {
                          padding: foundations.spacing[5],
                        },
                        [foundations.breakpoints.lg]: {
                          padding: foundations.spacing[6],
                        },
                      }}
                    >
                      <Component {...this.props} scrollToTop={this.scrollToTop} />
                    </View>
                  )}
                </View>
              )}
            </View>
          </Layout>
        </View>
      );
    }
  }

  return MasterPage;
};

/* istanbul ignore next */
const mapStateToProps = state => ({
  currentSession: (state as any).currentSession
});

export default (Page: any, options: MasterPageOptions) => connect(
  mapStateToProps,
  null
)(withMasterPage(Page, options));
