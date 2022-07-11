import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VernaProvider from '../providers/VernaProvider/';
import VernaForm from '../components/VernaForm';
import {
  checkBoxesSchemaFactory,
  checkBoxesUiSchemaFactory,
  selectSchemaFactory,
  translationsFactory,
  selectUiSchemaFactory,
  confSchemaFactory,
  widgetsFactory,
  translationUiFactory,
} from '../tests/mocks/factories';

describe('schema translations', () => {
  it('should translate the entire schema in default locale en', async () => {
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

    // Check that no translation key are displayed, those always start by root
    // and have the layout as ids in the schema
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    expect(screen.getByText(translations.en.root_title)).toBeInTheDocument();
    expect(screen.getByText(translations.en.root_description)).toBeInTheDocument();
    expect(screen.getByText(translations.en.root_testSection_title)).toBeInTheDocument();
  });

  it('should translate the entire schema in locale fr', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        defaultSchema={selectSchemaFactory()}
        defaultUiSchema={selectUiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        locale="fr"
        translationUi={translationUiFactory()}
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    expect(screen.getByText(translations.fr.root_title));
    expect(screen.getByText(translations.fr.root_description));
    expect(screen.getByText(translations.fr.root_testSection_title));
  });

  it('should translate the "enum" option in en', async () => {
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

    // Open parameters of the Select
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    // Check that option panel is open
    const options = await screen.findByRole('group', { name: 'Options' });
    expect(options).toBeInTheDocument();

    // wait for enum values to be displayed
    await waitFor(() => {
      expect(screen.getByText(translations.en.root_testSection_select_enum_0)).toBeInTheDocument();
      expect(screen.getByText(translations.en.root_testSection_select_enum_1)).toBeInTheDocument();
    });

    // change the value of the first enum
    const newEnum0Value = 'edit enum 0';
    const $newInputs = screen.getAllByRole('textbox', {});
    fireEvent.change($newInputs[2], { target: { value: newEnum0Value } });

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    const enum2Value = 'edit enum 2';
    fireEvent.change(screen.getAllByRole('textbox', {})[4], {
      target: { value: enum2Value },
    });

    // Save parameters
    screen.getByRole('button', { name: 'save' }).click();

    // Open parameters again
    const $parameterButtons2 = screen.getAllByRole('button', { name: 'Parameters' });
    await userEvent.click($parameterButtons2[2]);

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = await screen.findAllByRole('textbox', {});
    expect($inputs[2]).toHaveValue(newEnum0Value);
    expect($inputs[3]).toHaveValue(translations.en.root_testSection_select_enum_1);
    expect($inputs[4]).toHaveValue(enum2Value);
  });

  it('should translate the "items" option in en', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        configSchema={confSchemaFactory()}
        defaultSchema={checkBoxesSchemaFactory()}
        defaultUiSchema={checkBoxesUiSchemaFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // Open parameters of the Select
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    // Check that option panel is open
    const options = await screen.findByRole('group', { name: 'Options' });
    expect(options).toBeInTheDocument();

    // wait for enum values to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(translations.en.root_testSection_checkboxes_items_0),
      ).toBeInTheDocument();
      expect(
        screen.getByText(translations.en.root_testSection_checkboxes_items_1),
      ).toBeInTheDocument();
    });

    // change the value of the first item
    const newItem0Value = 'edit item 0';
    const $newInputs = screen.getAllByRole('textbox', {});
    fireEvent.change($newInputs[2], { target: { value: newItem0Value } });

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    const item2Value = 'edit item 2';
    fireEvent.change(screen.getAllByRole('textbox', {})[4], {
      target: { value: item2Value },
    });

    // Save parameters
    screen.getByRole('button', { name: 'save' }).click();

    // Open parameters again
    const $parameterButtons2 = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons2).toHaveLength(3);
    await userEvent.click($parameterButtons2[2]);

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = await screen.findAllByRole('textbox', {});
    expect($inputs[2]).toHaveValue(newItem0Value);
    expect($inputs[3]).toHaveValue(translations.en.root_testSection_checkboxes_items_1);
    expect($inputs[4]).toHaveValue(item2Value);
  });

  it('should translate the "items" option in fr', async () => {
    const translations = translationsFactory();
    const translationUi = translationUiFactory();

    render(
      <VernaProvider
        isEditor
        configSchema={confSchemaFactory()}
        defaultSchema={checkBoxesSchemaFactory()}
        defaultUiSchema={checkBoxesUiSchemaFactory()}
        locale="fr"
        translationUi={translationUi}
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // Open parameters of the Select
    const $parameterButtons = screen.getAllByRole('button', {
      name: translationUi['components.EditorFieldTemplate.parameters'],
    });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    // Check that option panel is open
    const options = await screen.findByRole('group', {
      name: translationUi['components.WidgetPropertiesForm.items'],
    });
    expect(options).toBeInTheDocument();

    // wait for enum values to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(translations.fr.root_testSection_checkboxes_items_0),
      ).toBeInTheDocument();
      expect(
        screen.getByText(translations.fr.root_testSection_checkboxes_items_1),
      ).toBeInTheDocument();
    });

    // change the value of the first item
    const newItem0Value = 'edit item 0 fr';
    const $newInputs = screen.getAllByRole('textbox', {});
    fireEvent.change($newInputs[2], { target: { value: newItem0Value } });

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    const item2Value = 'edit item 2 fr';
    fireEvent.change(screen.getAllByRole('textbox', {})[4], {
      target: { value: item2Value },
    });

    // Save parameters
    screen
      .getByRole('button', {
        name: translationUi['components.WidgetPropertiesForm.submitWidgetParameter'],
      })
      .click();

    // Open parameters again
    const $parameterButtons2 = screen.getAllByRole('button', {
      name: translationUi['components.EditorFieldTemplate.parameters'],
    });
    expect($parameterButtons2).toHaveLength(3);
    await userEvent.click($parameterButtons2[2]);

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = await screen.findAllByRole('textbox', {});
    expect($inputs[2]).toHaveValue(newItem0Value);
    expect($inputs[3]).toHaveValue(translations.fr.root_testSection_checkboxes_items_1);
    expect($inputs[4]).toHaveValue(item2Value);
  });
});
