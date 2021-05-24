import { t } from '@lingui/macro';

import { SIDEBAR_MENUS_SETTINGS, SIDEBAR_MENUS_INTEGRATIONS } from '@src/constants';

import { getNested } from '@go1d/mine/utils';
import { FeatureToggleModel } from '@go1d/go1d-exchange';

class MenuOptions {
  public getSettingsMenu = i18n => {
    let menu = [
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
        href: '/settings/theme',
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
        href: 'app/setup-portal',
        isApiomLink: true,
        isVisible: true,
      },
    ];

    return menu;
  };

  getIntegrationsMenu = (i18n, portal) => {
    // const { currentSession: { portal } } = this.props
    const allIntegrations = (portal && portal.configuration && portal.configuration.integrations) || {};

    const enabledIntegrations = {} as any;
    Object.keys(allIntegrations).forEach(name => {
      enabledIntegrations[name] = !!allIntegrations[name].status;
    });

    const featureToggles = {} as any;
    portal.featureToggles.forEach((feature: FeatureToggleModel) => {
      featureToggles[feature.raw.name] = feature.raw.enabled;
    });

    return [
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.ADDONS,
        title: i18n._(t`Addons`),
        href: 'app/integrations/addons',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.SCORM,
        title: featureToggles.xAPI ? i18n._(t`SCORM and xAPI`) : i18n._(t`Scorm`),
        href: featureToggles.xAPI ? '/integrations/scorm-and-xapi' : 'app/integrations/addon/scorm',
        isApiomLink: !featureToggles.xAPI,
        isVisible: !!enabledIntegrations.scorm,
        module: featureToggles.xAPI ? 'portal' : undefined,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.AUTOPILOT,
        title: i18n._(t`Autopilot`),
        href: 'app/integrations/addon/autopilot',
        isApiomLink: true,
        isVisible: !!enabledIntegrations.autopilot,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.STRIPE,
        title: i18n._(t`Stripe`),
        href: 'app/integrations/addon/stripe',
        isApiomLink: true,
        isVisible: !!enabledIntegrations.stripe,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.ZAPIER,
        title: i18n._(t`Zapier`),
        href: 'app/integrations/addon/zapier',
        isApiomLink: true,
        isVisible: !!enabledIntegrations.zapier,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.LTI_PROVIDER,
        title: i18n._(t`LTI Provider`),
        logo: '/assets/integrations/lti-provider.png',
        href: 'app/integrations/addon/ltiprovider',
        isApiomLink: true,
        isVisible: !!enabledIntegrations.ltiprovider,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.VETTRAK,
        title: i18n._(t`VETTRAK`),
        logo: '/assets/integrations/vettrak.png',
        href: 'app/integrations/addon/vettrak',
        isApiomLink: true,
        isVisible: !!enabledIntegrations.vettrak,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.WISENET,
        title: i18n._(t`Wisenet`),
        logo: '/assets/integrations/wisenet.gif',
        href: 'app/integrations/addon/wisenet',
        isApiomLink: true,
        isVisible: !!(enabledIntegrations.wisenet && featureToggles.wisenet),
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.XERO,
        title: i18n._(t`Xero`),
        logo: '/assets/integrations/xero-logo.png',
        href: 'app/integrations/addon/xero',
        isApiomLink: true,
        isVisible: !!(enabledIntegrations.xero && featureToggles.xero),
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.SUCCESS_FACTORS,
        title: i18n._(t`Success Factors`),
        logo: '/assets/integrations/successfactors.png',
        href: 'app/integrations/addon/successfactors',
        isApiomLink: true,
        isVisible: !!enabledIntegrations.successfactors,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.ORACLE,
        title: i18n._(t`Oracle`),
        href: '/integrations/oracle',
        isApiomLink: false,
        isVisible: !!enabledIntegrations.oracle,
        module: 'portal',
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.LITMOS,
        title: i18n._(t`Litmos`),
        href: '/integrations/litmos',
        isApiomLink: false,
        isVisible: !!enabledIntegrations.litmos,
        module: 'portal',
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.MAS,
        title: i18n._(t`Mas`),
        href: '/integrations/Mas',
        isApiomLink: false,
        isVisible: !!enabledIntegrations.mas,
        module: 'portal',
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.NAS,
        title: i18n._(t`Nas`),
        href: '/integrations/Nas',
        isApiomLink: false,
        isVisible: !!enabledIntegrations.nas,
        module: 'portal',
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.CANVAS_LMS,
        title: i18n._(t`Canvas`),
        logo: '/assets/integrations/canvas.png',
        href: '/integrations/canvas',
        isApiomLink: false,
        isVisible: !!enabledIntegrations.canvas,
        module: 'portal',
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.MICROSOFT_AZURE,
        title: i18n._(t`Microsoft 365`),
        logo: '/assets/integrations/Microsoft_Azure_Logo.png',
        href: '/integrations/azure',
        isApiomLink: false,
        isVisible: !!enabledIntegrations.azure,
        module: 'portal',
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.AZURE_B2C,
        title: i18n._(t`Azure B2C`),
        logo: '/assets/integrations/Azure-AD-B2C-Logo.png',
        href: 'app/integrations/addon/azureb2c',
        isApiomLink: true,
        isVisible: !!enabledIntegrations.azureb2c,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.COURSE_CATALOG,
        title: i18n._(t`Course Catalog`),
        href: 'app/integrations/embed',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.SINGLE_SIGN_ON,
        title: i18n._(t`Single Sign On`),
        href: featureToggles.cs_tool ? 'app/integrations/sso-saml' : 'app/integrations/sso',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.DEVELOPER,
        title: i18n._(t`Developer`),
        href: 'app/integrations/developer',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: SIDEBAR_MENUS_INTEGRATIONS.USER_DATA_FEED,
        title: i18n._(t`User Data Feed`),
        href: '/integrations/user-data-feed',
        isApiomLink: false,
        isVisible: !!featureToggles['user-data-feed'] || getNested(portal, 'configuration.data_mapping'),
        module: 'portal',
      },
    ];
  };
}

export default MenuOptions;
