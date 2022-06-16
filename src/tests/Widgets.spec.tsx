import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VernaProvider from '../providers/VernaProvider';
import {
  selectSchemaFactory,
  translationsFactory,
  uiSchemaFactory,
  confSchemaFactory,
  widgetsFactory,
} from './mocks/factories';
import VernaForm from '../components/VernaForm';

describe('widget properties edition', () => {
  it('should render a custom widget', async () => {
    const translations = translationsFactory();
    render(
      <VernaProvider
        isEditor
        defaultSchema={selectSchemaFactory()}
        defaultUiSchema={uiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    screen.getByRole('group', { name: translations.en.root_title });

    const $select = document.getElementById('root_testSection_select') as HTMLSelectElement;

    expect($select).toBeInstanceOf(HTMLSelectElement);
    expect($select.type).toBe('select-one');
  });

  it('should modify options of a custom widget and update it', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        configSchema={confSchemaFactory()}
        defaultSchema={selectSchemaFactory()}
        defaultUiSchema={uiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // Open parameters
    await userEvent.click(screen.getByRole('button', { name: 'Parameters' }));
    await screen.findByRole('group', { name: 'Options' });

    // Check required checkbox
    await userEvent.click(screen.getByRole('checkbox', { name: 'required' }));

    // Add two inputs in the list of choices
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    // Set the value of the new field
    const $newInputs = screen.getAllByRole('textbox', {});
    fireEvent.change($newInputs[2], { target: { value: 'newChoice1' } });
    fireEvent.change($newInputs[3], { target: { value: 'newChoice2' } });

    // Save parameters
    await userEvent.click(screen.getByRole('button', { name: 'save' }));

    // Open parameters again
    await userEvent.click(screen.getByRole('button', { name: 'Parameters' }));

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = screen.queryAllByRole('textbox', {});
    expect($inputs[0]).toHaveValue(translations.en.root_testSection_select_enum_0);
    expect($inputs[1]).toHaveValue(translations.en.root_testSection_select_enum_1);
    expect($inputs[2]).toHaveValue('newChoice1');
    expect($inputs[3]).toHaveValue('newChoice2');
  });
});
