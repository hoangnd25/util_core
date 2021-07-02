import getConfig from 'next/config';

const {
  publicRuntimeConfig: { CDN_PATH },
} = getConfig();

export const SIDEBAR_MENUS_INTEGRATIONS = {
  ADDONS: 'sidebar.integrations-addons',
  SCORM: 'sidebar.integrations-scorm',
  SCORM_AND_XAPI: 'sidebar.integrations-scorm-and-xapi',
  AUTOPILOT: 'sidebar.integrations-autopilot',
  STRIPE: 'sidebar.integrations-stripe',
  ZAPIER: 'sidebar.integrations-zapier',
  LTI_PROVIDER: 'sidebar.integrations-lti-provider',
  VETTRAK: 'sidebar.integrations-vettrak',
  WISENET: 'sidebar.integrations-wisenet',
  XERO: 'sidebar.integrations-xero',
  SUCCESS_FACTORS: 'sidebar.integrations-successfactors',
  CANVAS_LMS: 'sidebar.integrations-canvas-lms',
  MICROSOFT_AZURE: 'sidebar.integrations-azure',
  AZURE_B2C: 'sidebar.integrations-azure-b2c',
  COURSE_CATALOG: 'sidebar.integrations-course-catalog',
  SINGLE_SIGN_ON: 'sidebar.integrations-single-sign-on',
  DEVELOPER: 'sidebar.integrations-developers',
  USER_DATA_FEED: 'sidebar.integrations-user-data-feed',
  ORACLE: 'sidebar.integrations-oracle',
  MAS: 'sidebar.integrations-mas',
  NAS: 'sidebar.integrations-nas',
  LITMOS: 'sidebar.integrations-litmos',
};

export const SIDEBAR_MENUS_SETTINGS = {
  PORTAL_INFORMATION: 'sidebar.settings-portal-information',
  THEME: 'sidebar.settings-theme',
  CONFIGURATION: 'sidebar.settings-configuration',
  RECOMMENDATIONS: 'sidebar.settings-recommendations',
  PORTAL_CONTENT_SELECTION: 'sidebar.settings-portal-content-selection',
  NOTIFICATIONS: 'sidebar.settings-notifications',
  PLAN_AND_BILLING: 'sidebar.settings-plan-and-billing',
  SETUP_ACCOUNT: 'sidebar.settings-setup-account',
};

export const SETTINGS_THEME_FIELDS_MAPPING = {
  loginTitle: 'configuration.login_tagline',
  loginDescription: 'configuration.login_secondary_tagline',
  signupTitle: 'configuration.signup_tagline',
  signupDescription: 'configuration.signup_secondary_tagline',
  portalColor: { readPath: 'data.theme.primary', savePath: 'theme.primary' },
  signatureTitle: 'configuration.signature_title',
  signatureName: 'configuration.signature_name',
  dashboardWelcomeMessage: 'configuration.welcome',
  dashboardImageScale: 'files.feature_image_sizing_type',
};

export const SETTINGS_THEME_UPLOAD_FIELDS_MAPPING = {
  logo: 'files.logo',
  featuredImage: 'files.login_background',
  signatureImage: 'configuration.signature_image',
  dashboardImage: 'files.feature_image',
  dashboardIcon: 'files.dashboard_icon',
};

/**
 * @see https://github.com/go1com/util_core/blob/master/portal/PartnerConfigurationsInheritance.php
 */
export const SETTINGS_THEME_CUSTOMIZATION_GROUPS_MAPPING: Record<string, string> = {
  applyCustomizationLogo: 'logo',
  applyCustomizationPortalColor: 'portal_color',
  applyCustomizationFeaturedImage: 'featured_image',
  applyCustomizationCertificate: 'certificate',
  applyCustomizationDashboard: 'dashboard',
  applyCustomizationLogin: 'login',
  applyCustomizationSignup: 'signup',
};

export const PREVIEW_IMAGE_TYPE = ['logo', 'featuredImage'];

export const DEFAULT_LOGO = `${CDN_PATH}/Go1_Logo_Petrol_Green_sm.jpg`;
export const DEFAULT_LANDING_PAGE = `${CDN_PATH}/login_default_landing_page.jpg`;
