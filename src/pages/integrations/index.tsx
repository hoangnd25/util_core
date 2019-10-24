import { PortalModel } from '@go1d/go1d-exchange';
import MasterPage from '../index';

class Integrations extends MasterPage {
  constructor(props) {
    super(props);
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
        id: 'sidebar.integrations-addons',
        title: 'Add-ons',
        href: 'app/integrations/addons',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: 'sidebar.integrations-scorm',
        title: 'SCORM',
        href: 'app/integrations/addon/scorm',
        isApiomLink: true,
        isVisible: enabledIntegrations.scorm,
      },
      {
        id: 'sidebar.integrations-autopilot',
        title: 'Autopilot',
        href: 'app/integrations/addon/autopilot',
        isApiomLink: true,
        isVisible: enabledIntegrations.autopilot,
      },
      {
        id: 'sidebar.integrations-stripe',
        title: 'Stripe',
        href: 'app/integrations/addon/stripe',
        isApiomLink: true,
        isVisible: enabledIntegrations.stripe,
      },
      {
        id: 'sidebar.integrations-zapier',
        title: 'Zapier',
        href: 'app/integrations/addon/zapier',
        isApiomLink: true,
        isVisible: enabledIntegrations.zapier,
      },
      {
        id: 'sidebar.integrations-lti-provider',
        title: 'LTI Provider',
        href: 'app/integrations/addon/ltiprovider',
        isApiomLink: true,
        isVisible: enabledIntegrations.ltiprovider,
      },
      {
        id: 'sidebar.integrations-vettrak',
        title: 'Vettrak',
        href: 'app/integrations/addon/vettrak',
        isApiomLink: true,
        isVisible: enabledIntegrations.vettrak,
      },
      {
        id: 'sidebar.integrations-wisenet',
        title: 'Wisenet',
        href: 'app/integrations/addon/wisenet',
        isApiomLink: true,
        isVisible: enabledIntegrations.wisenet && featureToggles.wisenet,
      },
      {
        id: 'sidebar.integrations-xero',
        title: 'Xero',
        href: 'app/integrations/addon/xero',
        isApiomLink: true,
        isVisible: enabledIntegrations.xero && featureToggles.xero,
      },
      {
        id: 'sidebar.integrations-successfactors',
        title: 'SuccessFactors',
        href: 'app/integrations/addon/successfactors',
        isApiomLink: true,
        isVisible: enabledIntegrations.successfactors,
      },
      {
        id: 'sidebar.integrations-azure',
        title: 'Microsoft Azure',
        href: 'app/integrations/addon/azure',
        isApiomLink: true,
        isVisible: enabledIntegrations.azure,
      },
      {
        id: 'sidebar.integrations-course-catalog',
        title: 'Course Catalog',
        href: 'app/integrations/embed',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: 'sidebar.integrations-single-sign-on',
        title: 'Single Sign-On',
        href: featureToggles.cs_tool ? 'app/integrations/sso-saml' : 'app/integrations/sso',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: 'sidebar.integrations-azure',
        title: 'Developers',
        href: 'app/integrations/developer',
        isApiomLink: true,
        isVisible: true,
      },
      {
        id: 'sidebar.integrations-user-data-feed',
        title: 'User Data Feed',
        href: '/r/app/portal/integrations/user-data-feed',
        isApiomLink: false,
        isVisible: true,
      },
    ];

    return sidebarMenus;
  }
}

export default Integrations;
