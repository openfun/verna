import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import VernaForm from ':/components/VernaForm';
import VernaProvider from ':/providers/VernaProvider';
import {
  confSchemaFactory,
  widgetsFactory,
  vernaEnumSchemaFactory,
  checkBoxesSchemaFactory,
  checkBoxesUiSchemaFactory,
} from ':/tests/mocks/factories';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';

describe('widget properties edition', () => {
  const VernaSuspenseWrapper = ({
    factory = vernaEnumSchemaFactory,
    configSchema,
    locale = 'en-US',
    empty,
  }: {
    factory?: (empty?: boolean) => VernaSchemaType;
    configSchema?: VernaJSONSchemaType;
    locale?: string;
    empty?: boolean;
  }) => {
    return (
      <Suspense fallback="Loading...">
        <VernaProvider
          isEditor
          configSchema={configSchema}
          defaultSchema={factory(empty)}
          defaultWidgets={widgetsFactory()}
          locale={locale ? locale : 'en-US'}
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

    // Set the field name
    const $fieldInputs = screen.getAllByRole('textbox', {});

    expect($fieldInputs).toHaveLength(3);
    await userEvent.clear($fieldInputs[0]);
    await userEvent.type($fieldInputs[0], 'title');

    // Add two inputs in the list of choices
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Set the value of the new field
    const $newInputs = screen.getAllByRole('textbox');
    await userEvent.type($newInputs[3], 'Option 2');
    await userEvent.type($newInputs[4], 'Option 3');

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
    expect($inputs[1]).toHaveValue('Option 0');
    expect($inputs[2]).toHaveValue('Option 1');
    expect($inputs[3]).toHaveValue('Option 2');
    expect($inputs[4]).toHaveValue('Option 3');
  });

  it('should add options at any place and be properly set in other locale', async () => {
    const { rerender } = render(<VernaSuspenseWrapper configSchema={confSchemaFactory()} />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    await screen.findByRole('group', { name: 'Options' });

    // Add two inputs in the list of choices
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Set the value of the new field
    const $newInputs = screen.getAllByRole('textbox');
    await userEvent.clear($newInputs[1]);
    await userEvent.type($newInputs[1], 'New option 0');
    await userEvent.clear($newInputs[2]);
    await userEvent.type($newInputs[2], 'New option 1');
    await userEvent.type($newInputs[3], 'Option 2');
    await userEvent.type($newInputs[4], 'Option 3');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Open parameters again
    const $parameterButtons2 = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons2).toHaveLength(3);
    await userEvent.click($parameterButtons2[2]);

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    let $inputs = screen.getAllByRole('textbox', {});
    expect($inputs[1]).toHaveValue('New option 0');
    expect($inputs[2]).toHaveValue('New option 1');
    expect($inputs[3]).toHaveValue('Option 2');
    expect($inputs[4]).toHaveValue('Option 3');

    // Delete 2nd and 4th options
    const $deleteOptionButtons = screen.getAllByRole('button', { name: 'Remove' });
    await userEvent.click($deleteOptionButtons[1]);
    await userEvent.click($deleteOptionButtons[3]);

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Open parameters again
    await userEvent.click($parameterButtons2[2]);
    $inputs = screen.getAllByRole('textbox', {});
    expect($inputs).toHaveLength(3);
    expect($inputs[1]).toHaveValue('New option 0');
    expect($inputs[2]).toHaveValue('Option 2');

    // Change language
    rerender(<VernaSuspenseWrapper configSchema={confSchemaFactory()} locale="fr-FR" />);

    // Check that the options in French are properly updated after english modifications
    await userEvent.click($parameterButtons2[2]);
    const $options = screen.getAllByRole('option', {});
    expect($options).toHaveLength(2);
    expect($options[0]).toHaveValue('Choix 0');
    expect($options[1]).toHaveValue('Option 2');
  });

  it('should be able to create brand new component with an enum to edit', async () => {
    const { rerender } = render(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} />,
    );

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    await screen.findByRole('group', { name: 'Options' });

    // Add two inputs in the list of choices
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Set the value of the new field
    let $inputs = screen.getAllByRole('textbox');
    await userEvent.type($inputs[1], 'New option 0');
    await userEvent.type($inputs[2], 'New option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Open parameters again
    await userEvent.click($parameterButtons[2]);
    $inputs = screen.getAllByRole('textbox', {});
    expect($inputs).toHaveLength(3);
    expect($inputs[1]).toHaveValue('New option 0');
    expect($inputs[2]).toHaveValue('New option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Change the language
    rerender(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} locale="fr-FR" />,
    );

    // Open parameters again
    await userEvent.click($parameterButtons[2]);

    // Add french translations
    const $NewFrInputs = screen.getAllByRole('textbox');
    await userEvent.clear($NewFrInputs[1]);
    await userEvent.type($NewFrInputs[1], 'Nouvelle option 0');
    await userEvent.clear($NewFrInputs[2]);
    await userEvent.type($NewFrInputs[2], 'Nouvelle option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'sauvegarder' }));

    // Check that the options in French are properly updated after english modifications
    await userEvent.click($parameterButtons[2]);
    let $options = screen.getAllByRole('option', {});
    expect($options).toHaveLength(2);
    expect($options[0]).toHaveValue('Nouvelle option 0');
    expect($options[1]).toHaveValue('Nouvelle option 1');

    // Change back the language to english
    rerender(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} locale="en-US" />,
    );

    // Check that the options in english didn't changed
    $options = screen.getAllByRole('option', {});
    expect($options).toHaveLength(2);
    expect($options[0]).toHaveValue('New option 0');
    expect($options[1]).toHaveValue('New option 1');
  });

  it('should be able to create brand new component with items to edit', async () => {
    const { rerender } = render(
      <VernaSuspenseWrapper
        configSchema={confSchemaFactory()}
        factory={() => ({
          formSchema: checkBoxesSchemaFactory(true),
          translationSchema: {},
          uiSchema: checkBoxesUiSchemaFactory(),
        })}
      />,
    );

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    await screen.findByRole('group', { name: 'Options' });

    // Add two inputs in the list of choices
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Set the value of the new field
    let $inputs = screen.getAllByRole('textbox');
    await userEvent.type($inputs[1], 'New option 0');
    await userEvent.type($inputs[2], 'New option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Open parameters again
    await userEvent.click($parameterButtons[2]);
    $inputs = screen.getAllByRole('textbox', {});
    expect($inputs).toHaveLength(3);
    expect($inputs[1]).toHaveValue('New option 0');
    expect($inputs[2]).toHaveValue('New option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Change the language
    rerender(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} locale="fr-FR" />,
    );

    // Open parameters again
    await userEvent.click($parameterButtons[2]);

    // Add french translations
    const $NewFrInputs = screen.getAllByRole('textbox');
    await userEvent.clear($NewFrInputs[1]);
    await userEvent.type($NewFrInputs[1], 'Nouvelle option 0');
    await userEvent.clear($NewFrInputs[2]);
    await userEvent.type($NewFrInputs[2], 'Nouvelle option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'sauvegarder' }));

    // Check that the options in French are properly updated after english modifications
    await userEvent.click($parameterButtons[2]);
    let inputs = screen.getAllByRole('textbox', {});
    expect(inputs).toHaveLength(3);
    expect(inputs[1]).toHaveValue('Nouvelle option 0');
    expect(inputs[2]).toHaveValue('Nouvelle option 1');

    // Change back the language to english
    rerender(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} locale="en-US" />,
    );

    // Check that the options in english didn't changed
    inputs = screen.getAllByRole('textbox', {});
    expect(inputs).toHaveLength(3);
    expect(inputs[1]).toHaveValue('New option 0');
    expect(inputs[2]).toHaveValue('New option 1');

    // Change back the language to check again the french translations
    rerender(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} locale="fr-FR" />,
    );

    // Check that the options in english didn't changed
    inputs = screen.getAllByRole('textbox', {});
    expect(inputs).toHaveLength(3);
    expect(inputs[1]).toHaveValue('Nouvelle option 0');
    expect(inputs[2]).toHaveValue('Nouvelle option 1');
  });

  it('should be able to create new component with items and edit the translations', async () => {
    const { rerender } = render(
      <VernaSuspenseWrapper
        configSchema={confSchemaFactory()}
        factory={() => ({
          formSchema: checkBoxesSchemaFactory(true),
          translationSchema: {},
          uiSchema: checkBoxesUiSchemaFactory(),
        })}
      />,
    );

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    await screen.findByRole('group', { name: 'Options' });

    // Add two inputs in the list of choices
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Set the value of the new field
    let $inputs = screen.getAllByRole('textbox');
    await userEvent.type($inputs[1], 'New option 0');
    await userEvent.type($inputs[2], 'New option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Open parameters again
    await userEvent.click($parameterButtons[2]);
    $inputs = screen.getAllByRole('textbox', {});
    expect($inputs).toHaveLength(3);
    expect($inputs[1]).toHaveValue('New option 0');
    expect($inputs[2]).toHaveValue('New option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Change the language
    rerender(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} locale="fr-FR" />,
    );

    // Open parameters again
    await userEvent.click($parameterButtons[2]);

    // Add french translations
    const $NewFrInputs = screen.getAllByRole('textbox');
    await userEvent.clear($NewFrInputs[1]);
    await userEvent.type($NewFrInputs[1], 'Nouvelle option 0');
    await userEvent.clear($NewFrInputs[2]);
    await userEvent.type($NewFrInputs[2], 'Nouvelle option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'sauvegarder' }));

    // Check that the options in French are properly updated after english modifications
    await userEvent.click($parameterButtons[2]);
    let inputs = screen.getAllByRole('textbox', {});
    expect(inputs).toHaveLength(3);
    expect(inputs[1]).toHaveValue('Nouvelle option 0');
    expect(inputs[2]).toHaveValue('Nouvelle option 1');

    // Change back the language to english
    rerender(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} locale="en-US" />,
    );

    // Open parameters again
    await userEvent.click($parameterButtons[3]);

    // Edit english translations
    const $NewEditedEnInputs = screen.getAllByRole('textbox');
    await userEvent.clear($NewEditedEnInputs[1]);
    await userEvent.type($NewEditedEnInputs[1], 'New edited option 0');
    await userEvent.clear($NewEditedEnInputs[2]);
    await userEvent.type($NewEditedEnInputs[2], 'New edited option 1');

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Open parameters again
    await userEvent.click($parameterButtons[2]);

    // Check that the options in english did changed
    inputs = screen.getAllByRole('textbox', {});
    expect(inputs).toHaveLength(3);
    expect(inputs[1]).toHaveValue('New edited option 0');
    expect(inputs[2]).toHaveValue('New edited option 1');

    // Change back the language to check again the french translations
    rerender(
      <VernaSuspenseWrapper configSchema={confSchemaFactory()} empty={true} locale="fr-FR" />,
    );

    // Check that the options in english didn't changed
    inputs = screen.getAllByRole('textbox', {});
    expect(inputs).toHaveLength(3);
    expect(inputs[1]).toHaveValue('Nouvelle option 0');
    expect(inputs[2]).toHaveValue('Nouvelle option 1');
  });
});
