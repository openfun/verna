import type { ResolvedIntlConfig } from 'react-intl';

export interface TranslationType {
  [locale: string]: ResolvedIntlConfig['messages'];
}
