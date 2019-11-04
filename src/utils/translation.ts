import { defineMessages, IntlProvider } from 'react-intl';
import messagesEN_AU from '../translation/lang/en.json';
import messagesPT from '../translation/lang/pt.json';

export const defaultLocale = 'en';

export const countryToLocale = {
  AU: defaultLocale,
  GB: 'en-uk',
  US: 'en-us',
};

export const messages = {
  pt: messagesPT,
  [defaultLocale]: messagesEN_AU,
};

export const defineMessagesList = () => {
  return defineMessages({
    dataFeedEmptyBlockTitle: {
      id: 'data.feed.empty.block.title',
      defaultMessage: 'No Data Yet',
    },
    dataFeedEmptyBlockActionText: {
      id: 'data.feed.empty.block.action.text',
      defaultMessage: 'Start',
    },
    dataFeedUploadBlockErrorTextFileExtension: {
      id: 'data.feed.upload.block.error.text.file.extension',
      defaultMessage: '{fileName} is not a supported file type',
    },

    // Integration detail: User data feed mapping
    userDataFeedMappingSkipField: {
      id: 'userDataFeed.block.mapping.skipField',
      defaultMessage: 'Skip this field',
    },
    userDataFeedMappingSelectFieldPlaceholder: {
      id: 'userDataFeed.block.mapping.selectAField',
      defaultMessage: 'Select a field',
    },
    userDataFeedMappingFailedError: {
      id: 'userDataFeed.block.mapping.failedError',
      defaultMessage: 'Failed to save your mapping, please try again or contact us for assistance',
    },

    // Integration detail: User data feed
    integrationUserDataFeedPageTitle: {
      id: 'integrationUserDataFeed.pageTitle',
      defaultMessage: 'User data feed',
    },
    integrationUserDataFeedSidebarTitle: {
      id: 'integrationUserDataFeed.sidebarTitle',
      defaultMessage: 'Integrations',
    },
    integrationUserDataFeedConnectionDetailTitle: {
      id: 'integrationUserDataFeed.connectionDetailTitle',
      defaultMessage: 'Your data feed',
    },

    // AWS connection detail
    awsConnectionDetailCopied: {
      id: 'awsConnectionDetail.Copied',
      defaultMessage: 'Copied!',
    },
  });
};

export const getIntl = (locale?: string) => {
  const intlLocale = locale || defaultLocale;
  const intlProvider = new IntlProvider({ intlLocale, messages: messages[intlLocale] });
  const { intl } = intlProvider.getChildContext();
  return intl;
}

export const getText = (searchKey, locale) => {
  const intl = getIntl(locale);
  const dictionary = defineMessages({
    'sidebar.integrations-addons': {
      id: 'sidebar.integrations-addons',
      defaultMessage: 'Add-ons',
    },
    'sidebar.integrations-scorm': {
      id: 'sidebar.integrations-scorm',
      defaultMessage: 'SCORM',
    },
    'sidebar.integrations-autopilot': {
      id: 'sidebar.integrations-autopilot',
      defaultMessage: 'Autopilot',
    },
    'sidebar.integrations-stripe': {
      id: 'sidebar.integrations-stripe',
      defaultMessage: 'Stripe',
    },
    'sidebar.integrations-zapier': {
      id: 'sidebar.integrations-zapier',
      defaultMessage: 'Zapier',
    },
    'sidebar.integrations-lti-provider': {
      id: 'sidebar.integrations-lti-provider',
      defaultMessage: 'LTI Provider',
    },
    'sidebar.integrations-vettrak': {
      id: 'sidebar.integrations-vettrak',
      defaultMessage: 'Vettrak',
    },
    'sidebar.integrations-wisenet': {
      id: 'sidebar.integrations-wisenet',
      defaultMessage: 'Wisenet',
    },
    'sidebar.integrations-xero': {
      id: 'sidebar.integrations-xero',
      defaultMessage: 'Xero',
    },
    'sidebar.integrations-successfactors': {
      id: 'sidebar.integrations-successfactors',
      defaultMessage: 'SuccessFactors',
    },
    'sidebar.integrations-azure': {
      id: 'sidebar.integrations-azure',
      defaultMessage: 'Microsoft Azure',
    },
    'sidebar.integrations-course-catalog': {
      id: 'sidebar.integrations-course-catalog',
      defaultMessage: 'Course Catalog',
    },
    'sidebar.integrations-single-sign-on': {
      id: 'sidebar.integrations-single-sign-on',
      defaultMessage: 'Single Sign-On',
    },
    'sidebar.integrations-developers': {
      id: 'sidebar.integrations-developers',
      defaultMessage: 'Developers',
    },
    'sidebar.integrations-user-data-feed': {
      id: 'sidebar.integrations-user-data-feed',
      defaultMessage: 'User Data Feed',
    },
  });

  return intl.formatMessage(dictionary[searchKey]);
}
