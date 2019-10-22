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
