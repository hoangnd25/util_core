import { CurrentSessionType } from '@src/types/user';
import enAU from '@src/locales/en/messages';

export const defaultLocale = 'en';

export const countryToLocale = {
  AU: defaultLocale,
  GB: defaultLocale,
  US: defaultLocale,
};

export const messages = {
  [defaultLocale]: enAU,
};

export const getLocale = (currentSession: CurrentSessionType) => {
  if (currentSession) {
    const { user, portal } = currentSession;

    if (user && user.locale) {
      return user.locale[0] || defaultLocale;
    }
    if (portal && portal.configuration) {
      return countryToLocale[portal.configuration.locale || 'AU'] || defaultLocale;
    }
  }
  return defaultLocale;
}