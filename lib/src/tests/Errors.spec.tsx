import type { AjvError } from '@rjsf/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import VernaForm from ':/components/VernaForm';
import VernaProvider from ':/providers/VernaProvider';
import { vernaSchemaFactory, widgetsFactory } from ':/tests/mocks/factories';

describe('custom errors', () => {
  function transformErrors(errors: AjvError[]): AjvError[] {
    return errors.map((error) => {
      if (error.name === 'minimum') {
        error.message = `The value must be ${error.params.comparison} to ${error.params.limit}`;
      }
      if (error.name === 'maximum') {
        error.message = 'Your value exceeds the maximum';
      }
      return error;
    });
  }

  it('should display the custom errors', async () => {
    render(
      <Suspense fallback="Loading...">
        <VernaProvider
          defaultSchema={vernaSchemaFactory()}
          defaultWidgets={widgetsFactory()}
          locale="en-US"
          transformErrors={transformErrors}
        >
          <div data-testid="wrapper">
            <VernaForm />
          </div>
        </VernaProvider>
      </Suspense>,
    );

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    // Get the number input
    const $input = screen.getByLabelText('First field');

    // Check that the minimum error message is the custom one
    await userEvent.type($input, '3');
    screen.getByText('The value must be >= to 5');

    await userEvent.clear($input);

    // Check that the maximum error message is the custom one
    await userEvent.type($input, '11');
    screen.getByText('Your value exceeds the maximum');

    await userEvent.clear($input);

    expect(screen.queryByText('The value must be >= to 5')).toBeNull();
    expect(screen.queryByText('Your value exceeds the maximum')).toBeNull();
  });
});
