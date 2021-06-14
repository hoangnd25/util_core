import React from 'react';
import { I18nProvider, I18n } from '@lingui/react';
import { getSupportedLocale } from '@go1d/go1d-exchange/build/utils/Locale';

export const defaultLocale = 'en-US';

export const countryToLocale = {
  AU: defaultLocale,
  GB: defaultLocale,
  US: defaultLocale,
};

export const getLocale = (currentSession) => {
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
};

export default function withI18n(App, language = defaultLocale) {
  return class WithI18n extends React.Component<{
    language: string;
    catalogs: any;
  }> {
    static async getInitialProps(ctx) {
      const {
        router: { query }, // @TODO check query for lang if session does not exist
        ctx: { store },
      } = ctx;

      const { currentSession } = store?.getState();
      if (query.locale) {
        language = query.locale;
      } else if (currentSession) {
        language = getLocale(currentSession);
      }

      language = getSupportedLocale(language);
      const [props, catalog] = await Promise.all([
        App.getInitialProps ? App.getInitialProps(ctx) : {},
        import(`@src/locale/${language}/messages.po`).then((m) => m.default).catch(() => {}),
      ]);

      return {
        ...props,
        language,
        catalogs: {
          [language]: catalog,
        },
      };
    }

    render() {
      const { language: lang, catalogs, ...props } = this.props;
      return (
        <I18nProvider language={lang} catalogs={catalogs}>
          <I18n>{({ i18n }) => <App i18n={i18n} {...props} />}</I18n>
        </I18nProvider>
      );
    }
  };
}
