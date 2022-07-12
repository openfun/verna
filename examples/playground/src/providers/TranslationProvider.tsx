import { IntlProvider } from 'react-intl';
import { PropsWithChildren } from 'react';
import { useLocale } from './LocaleProvider';
import en from '../translations/en-US.json';
import fr from '../translations/fr-FR.json';

const resources = {
  'en-US': en,
  'fr-FR': fr,
};

/**
 * A bridge to react-intl to be able to update intl object when locale changes.
 * @param messages
 * @param children
 */
const TranslationProvider = ({ children }: PropsWithChildren<{}>) => {
  const [locale] = useLocale();
  const messages = locale in resources ? resources[locale as keyof typeof resources] : {};

  return (
    <IntlProvider defaultLocale="en-US" locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default TranslationProvider;
