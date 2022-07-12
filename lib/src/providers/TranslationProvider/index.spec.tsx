import { screen, render, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { createIntl, FormattedMessage, type ResolvedIntlConfig } from 'react-intl';
import TranslationProvider from '.';

jest.mock('../../translations/fr-FR.json', () => ({
  __esModule: true,
  default: {
    title: 'Un titre',
  },
}));

describe('TranslationProvider', () => {
  const VernaSuspenseWrapper = ({
    intl,
    locale,
  }: {
    intl?: ResolvedIntlConfig;
    locale?: string;
  }) => (
    <Suspense fallback={<span data-testid="suspense-fallback" />}>
      <TranslationProvider intl={intl} locale={locale}>
        <h1>
          <FormattedMessage defaultMessage="A title" id="title" />
        </h1>
      </TranslationProvider>
    </Suspense>
  );

  it('should lazy load translations', async () => {
    const { rerender } = render(<VernaSuspenseWrapper locale="en-US" />);

    // - Component should be suspended until en-US translations are loaded
    screen.getByTestId('suspense-fallback');

    // - As there is no en-US translations, default messages should be used
    await waitFor(() => {
      screen.getByRole('heading', { level: 1, name: 'A title' });
    });

    // - Rerender component with fr-FR locale
    rerender(<VernaSuspenseWrapper locale="fr-FR" />);

    // - Component should be suspended until fr-FR translations are loaded
    screen.getByTestId('suspense-fallback');

    // - As there is fr-FR translations, the correct message should be used
    await waitFor(() => {
      screen.getByRole('heading', { level: 1, name: 'Un titre' });
    });
  });

  it('should merge provided intl context', async () => {
    const intl = createIntl({
      locale: 'en-US',
      messages: {
        title: 'A custom title',
      },
    });

    render(<VernaSuspenseWrapper intl={intl} />);

    // - It should use the custom title message defined through provided intl context
    await waitFor(() => {
      screen.getByRole('heading', { level: 1, name: 'A custom title' });
    });
  });
});
