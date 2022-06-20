import {
  schemaFactory,
  transformErrors,
  translationsFactory,
  uiSchemaFactory,
  widgetsFactory,
} from './mocks/factories';
import { render, screen, waitFor } from '@testing-library/react';
import VernaProvider from '../providers/VernaProvider';
import VernaForm from '../components/VernaForm';
import userEvent from '@testing-library/user-event';

describe('custom errors', () => {
  it('should display the custom errors', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        defaultSchema={schemaFactory()}
        defaultUiSchema={uiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        isEditor={false}
        locale="en"
        transformErrors={transformErrors}
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    // Get the number input
    const $input = screen.getByLabelText(translations.en.root_testSection_field1);

    // Check that the minimum error message is the custom one
    await userEvent.type($input, '3');
    screen.getByText('The value must be >= to 5');

    await userEvent.clear($input);

    // Check that the maximum error message is the custom one
    await userEvent.type($input, '11');
    screen.getByText('Your value exceeds the maximum');

    await userEvent.clear($input);

    await waitFor(() => {
      expect(screen.queryByText('The value must be >= to 5')).toBeNull();
      expect(screen.queryByText('Your value exceeds the maximum')).toBeNull();
    });
  });
});
