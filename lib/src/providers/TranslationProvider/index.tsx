import { PropsWithChildren, useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider, type ResolvedIntlConfig } from 'react-intl';
import { VERNA_SUPPORTED_LOCALES } from ':/settings';
import { TranslationType } from ':/types/translations';
import resourceLoader, { type ResourceLoader } from ':/utils/suspense/resourceLoader';

interface TranslationProviderProps {
  defaultLocale?: string;
  intl?: ResolvedIntlConfig;
  locale?: string;
  schemaTranslations?: TranslationType;
}

type MessageLoader = ResourceLoader<ResolvedIntlConfig['messages']>;
type MessageLoaders = Record<string, MessageLoader>;

const messagesLoader = (locale: string): MessageLoader =>
  resourceLoader(() =>
    import(`:/translations/${locale}.json`).then(
      (response: { default: ResolvedIntlConfig['messages'] }) => response.default,
    ),
  );

const messageLoaders: MessageLoaders = VERNA_SUPPORTED_LOCALES.reduce(
  (loaders: MessageLoaders, locale: string) => ({
    ...loaders,
    [locale]: messagesLoader(locale),
  }),
  {},
);

/**
 * A custom RawIntlProvider to lazy-load library translations and merge
 * a configuration provided from an upper Intl context.
 *
 */
const TranslationProvider = ({
  children,
  defaultLocale,
  intl,
  locale,
  schemaTranslations,
}: PropsWithChildren<TranslationProviderProps>) => {
  const cache = useMemo(createIntlCache, []);
  const lang = useMemo(
    () => intl?.locale || locale || defaultLocale!,
    [intl?.locale, locale, defaultLocale],
  );
  const messages = {
    ...messageLoaders[lang]?.read(),
    ...intl?.messages,
    ...schemaTranslations?.[lang],
  };

  const vernaIntl = createIntl(
    {
      defaultLocale,
      locale: lang,
      ...intl,
      messages,
    },
    cache,
  );

  return <RawIntlProvider value={vernaIntl}>{children}</RawIntlProvider>;
};

TranslationProvider.defaultProps = {
  defaultLocale: 'en-US',
};

export default TranslationProvider;
