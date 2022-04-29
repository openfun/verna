import { fireEvent, render, screen } from '@testing-library/react';
import { VernaContextProvider } from '../context/VernaContextProvider';
import VernaForm from '../index';
import {
  getCustomSchemaDefault,
  getUiSchemaDefault,
  getWidgetConf,
  getWidgets,
} from './mocks/FormProps';

describe('tests widget customization', () => {
  it('should render a custom widget', async () => {
    render(
      <VernaContextProvider
        isEditor
        defaultSchema={getCustomSchemaDefault()}
        defaultUiSchema={getUiSchemaDefault()}
        defaultWidgets={getWidgets()}
      >
        <VernaForm />
      </VernaContextProvider>,
    );

    screen.getByRole('group', { name: 'A registration form' });

    const $select = document.getElementById('root_testSection_select') as HTMLSelectElement;

    expect($select).toBeInstanceOf(HTMLSelectElement);
    expect($select.type).toBe('select-one');
  });

  it('should modify options of a custom widget and load it', async () => {
    render(
      <VernaContextProvider
        isEditor
        configSchema={getWidgetConf()}
        defaultSchema={getCustomSchemaDefault()}
        defaultUiSchema={getUiSchemaDefault()}
        defaultWidgets={getWidgets()}
      >
        <VernaForm />
      </VernaContextProvider>,
    );

    // Open edit options
    screen.getByRole('button', { name: 'Edit' }).click();
    screen.getByRole('group', { name: 'enum' });

    // Check required checkbox
    screen.getByRole('checkbox', { name: 'required' }).click();

    // Add two inputs in the list of choices
    screen.getByRole('button', { name: 'Add' }).click();
    screen.getByRole('button', { name: 'Add' }).click();

    // Set the value of the new field
    const $newInputs = screen.getAllByRole('textbox', { name: '' });
    fireEvent.change($newInputs[0], { target: { value: 'newChoice1' } });
    fireEvent.change($newInputs[1], { target: { value: 'newChoice2' } });

    // Save parameters
    screen.getAllByRole('button', { name: 'Submit' })[0].click();

    // Open edit options again
    screen.getByRole('button', { name: 'Edit' }).click();

    // Check that the previous options are loaded correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = screen.getAllByRole('textbox', { name: '' });
    expect($inputs[0]).toHaveValue('newChoice1');
    expect($inputs[1]).toHaveValue('newChoice2');
  });
});
