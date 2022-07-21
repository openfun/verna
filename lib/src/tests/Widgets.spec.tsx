import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import VernaForm from ':/components/VernaForm';
import VernaProvider from ':/providers/VernaProvider';
import {
  selectSchemaFactory,
  translationsFactory,
  selectUiSchemaFactory,
  confSchemaFactory,
  widgetsFactory,
} from ':/tests/mocks/factories';
import VernaJSONSchemaType from ':/types/rjsf';

describe('widget properties edition', () => {
  const VernaSuspenseWrapper = ({ configSchema }: { configSchema?: VernaJSONSchemaType }) => {
    const translations = translationsFactory();
    return (
      <Suspense fallback="Loading...">
        <VernaProvider
          isEditor
          configSchema={configSchema}
          defaultSchema={selectSchemaFactory()}
          defaultUiSchema={selectUiSchemaFactory()}
          defaultWidgets={widgetsFactory()}
          locale="en-US"
          translations={translations}
        >
          <div data-testid="wrapper">
            <VernaForm />
          </div>
        </VernaProvider>
      </Suspense>
    );
  };

  it('should render a custom widget', async () => {
    render(<VernaSuspenseWrapper />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    screen.getByRole('group', { name: 'A registration form' });

    const $select = document.getElementById('root_testSection_select') as HTMLSelectElement;

    expect($select).toBeInstanceOf(HTMLSelectElement);
    expect($select.type).toBe('select-one');
  });

  it('should modify options of a custom widget and update it', async () => {
    render(<VernaSuspenseWrapper configSchema={confSchemaFactory()} />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    await screen.findByRole('group', { name: 'Options' });

    // Check required checkbox
    await userEvent.click(screen.getByRole('checkbox', { name: 'required' }));

    // Set the field name and description
    const $fieldInputs = screen.getAllByRole('textbox', {});
    fireEvent.change($fieldInputs[0], { target: { value: 'title' } });
    fireEvent.change($fieldInputs[1], { target: { value: 'description' } });

    // Add two inputs in the list of choices
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Set the value of the new field
    const $newInputs = screen.getAllByRole('textbox');
    fireEvent.change($newInputs[4], { target: { value: 'Option 2' } });
    fireEvent.change($newInputs[5], { target: { value: 'Option 3' } });

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Open parameters again
    const $parameterButtons2 = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons2).toHaveLength(3);
    await userEvent.click($parameterButtons2[2]);

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = screen.getAllByRole('textbox', {});
    expect($inputs[0]).toHaveValue('title');
    expect($inputs[1]).toHaveValue('description');
    expect($inputs[2]).toHaveValue('Option 0');
    expect($inputs[3]).toHaveValue('Option 1');
    expect($inputs[4]).toHaveValue('Option 2');
    expect($inputs[5]).toHaveValue('Option 3');
  });
});
