import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VernaProvider from '../providers/VernaProvider';
import {
  selectSchemaFactory,
  translationsFactory,
  selectUiSchemaFactory,
  confSchemaFactory,
  widgetsFactory,
} from './mocks/factories';
import VernaForm from '../components/VernaForm';

describe('section properties edition', () => {
  it('should render a custom section', async () => {
    const translations = translationsFactory();
    render(
      <VernaProvider
        isEditor
        defaultSchema={selectSchemaFactory()}
        defaultUiSchema={selectUiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    screen.getByRole('group', { name: translations.en.root_title });

    // Check that section title and description are displayed
    screen.getByRole('group', { name: translations.en.root_testSection_title });
    screen.getByText(translations.en.root_testSection_description);

    const $select = document.getElementById('root_testSection_select') as HTMLSelectElement;

    expect($select).toBeInstanceOf(HTMLSelectElement);
    expect($select.type).toBe('select-one');
  });

  it('should modify options of a custom section and update it', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        configSchema={confSchemaFactory()}
        defaultSchema={selectSchemaFactory()}
        defaultUiSchema={selectUiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // Open parameters
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[1]);
    await screen.findByRole('group', { name: 'Options' });

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
