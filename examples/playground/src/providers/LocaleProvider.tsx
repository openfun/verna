import { PropsWithChildren, useState, createContext, useContext } from 'react';

const LocaleContext = createContext<[string, (locale: string) => void]>([
  navigator.language,
  () => {},
]);

/**
 * A Provider to manage the active locale through the app. By default, it uses the browser language.
 */
const LocaleProvider = ({ children }: PropsWithChildren<{}>) => {
  const [locale, setLocale] = useState<string>('en-US');

  return <LocaleContext.Provider value={[locale, setLocale]}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};

export default LocaleProvider;
