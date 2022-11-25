import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import VernaForm from ':/components/VernaForm';
import VernaProvider from ':/providers/VernaProvider';
import { confSchemaFactory, widgetsFactory, vernaEnumSchemaFactory } from ':/tests/mocks/factories';
import VernaJSONSchemaType from ':/types/rjsf';

describe('section properties edition', () => {
  const VernaSuspenseWrapper = ({ configSchema }: { configSchema?: VernaJSONSchemaType }) => {
    return (
      <Suspense fallback="Loading...">
        <VernaProvider
          isEditor
          configSchema={configSchema}
          defaultSchema={vernaEnumSchemaFactory()}
          defaultWidgets={widgetsFactory()}
          locale="en-US"
        >
          <div data-testid="wrapper">
            <VernaForm />
          </div>
        </VernaProvider>
      </Suspense>
    );
  };

  it('should render a custom section', async () => {
    render(<VernaSuspenseWrapper />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    screen.getByRole('group', { name: 'A registration form' });

    // Check that section title and description are displayed
    screen.getByRole('group', { name: 'First section' });
    screen.getByText('Description of the first section');

    const $select = document.getElementById('root_testSection_select') as HTMLSelectElement;

    expect($select).toBeInstanceOf(HTMLSelectElement);
    expect($select.type).toBe('select-one');
  });

  it('should modify options of a custom section and update it', async () => {
    render(<VernaSuspenseWrapper configSchema={confSchemaFactory()} />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[1]);

    // Set the field name and description
    const $fieldInputs = screen.getAllByRole('textbox', {});
    fireEvent.change($fieldInputs[0], { target: { value: 'title' } });
    fireEvent.change($fieldInputs[1], { target: { value: 'description' } });

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    // Open parameters again
    const $parameterButtons2 = screen.getAllByRole('button', { name: 'Parameters' });
    await userEvent.click($parameterButtons2[1]);

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = screen.getAllByRole('textbox', {});
    expect($inputs[0]).toHaveValue('title');
    expect($inputs[1]).toHaveValue('description');
  });
});
