import { PortalModel } from '@go1d/go1d-exchange';
import { SIDEBAR_MENUS } from '../../constants/sidebarMenu';
import { getText } from '../../utils/translation';
import MasterPage from '../index';

class Integrations extends MasterPage {
  constructor(props) {
    super(props);
  }

  getString(searchKey: string): string {
    const locale = typeof window !== 'undefined' ? (window as any).locale : undefined;
    return getText(searchKey, locale);
  }

  getSidebarMenus() {
    const { currentSession, featureToggles = {} } = this.props;
    const portal = new PortalModel(currentSession.portal || {});
    const allIntegrations = (portal && portal.configuration && portal.configuration.integrations) || {};

    const enabledIntegrations = {} as any;
    Object.getOwnPropertyNames(allIntegrations).forEach(name => {
      enabledIntegrations[name] = !!allIntegrations[name].status;
    });

    const sidebarMenus = [
      {
        id: SIDEBAR_MENUS.ADDONS,
        title: this.getString(SIDEBAR_MENUS.ADDONS),
        href: 'app/integrations/addons',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: SIDEBAR_MENUS.SCORM,
        title: this.getString(SIDEBAR_MENUS.SCORM),
        href: 'app/integrations/addon/scorm',
        isApiomLink: true,
        isVisible: enabledIntegrations.scorm,
      },
      {
        id: SIDEBAR_MENUS.AUTOPILOT,
        title: this.getString(SIDEBAR_MENUS.AUTOPILOT),
        href: 'app/integrations/addon/autopilot',
        isApiomLink: true,
        isVisible: enabledIntegrations.autopilot,
      },
      {
        id: SIDEBAR_MENUS.STRIPE,
        title: this.getString(SIDEBAR_MENUS.STRIPE),
        href: 'app/integrations/addon/stripe',
        isApiomLink: true,
        isVisible: enabledIntegrations.stripe,
      },
      {
        id: SIDEBAR_MENUS.ZAPIER,
        title: this.getString(SIDEBAR_MENUS.ZAPIER),
        href: 'app/integrations/addon/zapier',
        isApiomLink: true,
        isVisible: enabledIntegrations.zapier,
      },
      {
        id: SIDEBAR_MENUS.LTI_PROVIDER,
        title: this.getString(SIDEBAR_MENUS.LTI_PROVIDER),
        href: 'app/integrations/addon/ltiprovider',
        isApiomLink: true,
        isVisible: enabledIntegrations.ltiprovider,
      },
      {
        id: SIDEBAR_MENUS.VETTRAK,
        title: this.getString(SIDEBAR_MENUS.VETTRAK),
        href: 'app/integrations/addon/vettrak',
        isApiomLink: true,
        isVisible: enabledIntegrations.vettrak,
      },
      {
        id: SIDEBAR_MENUS.WISENET,
        title: this.getString(SIDEBAR_MENUS.WISENET),
        href: 'app/integrations/addon/wisenet',
        isApiomLink: true,
        isVisible: enabledIntegrations.wisenet && featureToggles.wisenet,
      },
      {
        id: SIDEBAR_MENUS.XERO,
        title: this.getString(SIDEBAR_MENUS.XERO),
        href: 'app/integrations/addon/xero',
        isApiomLink: true,
        isVisible: enabledIntegrations.xero && featureToggles.xero,
      },
      {
        id: SIDEBAR_MENUS.SUCCESS_FACTORS,
        title: this.getString(SIDEBAR_MENUS.SUCCESS_FACTORS),
        href: 'app/integrations/addon/successfactors',
        isApiomLink: true,
        isVisible: enabledIntegrations.successfactors,
      },
      {
        id: SIDEBAR_MENUS.MICROSOFT_AZURE,
        title: this.getString(SIDEBAR_MENUS.MICROSOFT_AZURE),
        href: 'app/integrations/addon/azure',
        isApiomLink: true,
        isVisible: enabledIntegrations.azure,
      },
      {
        id: SIDEBAR_MENUS.COURSE_CATALOG,
        title: this.getString(SIDEBAR_MENUS.COURSE_CATALOG),
        href: 'app/integrations/embed',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: SIDEBAR_MENUS.SINGLE_SIGN_ON,
        title: this.getString(SIDEBAR_MENUS.SINGLE_SIGN_ON),
        href: featureToggles.cs_tool ? 'app/integrations/sso-saml' : 'app/integrations/sso',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: SIDEBAR_MENUS.DEVELOPER,
        title: this.getString(SIDEBAR_MENUS.DEVELOPER),
        href: 'app/integrations/developer',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: SIDEBAR_MENUS.USER_DATA_FEED,
        title: this.getString(SIDEBAR_MENUS.USER_DATA_FEED),
        href: '/r/app/portal/integrations/user-data-feed',
        isApiomLink: false,
        isVisible: true,
      },
    ];

    return sidebarMenus;
  }
}

export default Integrations;
