import { type UiSchema } from '@rjsf/core';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { noop } from 'lodash';
import { Suspense } from 'react';
import { createIntl, IntlProvider, type ResolvedIntlConfig } from 'react-intl';
import VernaForm from ':/components/VernaForm';
import VernaProvider, { WidgetsType } from ':/providers/VernaProvider';
import {
  checkBoxesSchemaFactory,
  checkBoxesUiSchemaFactory,
  selectSchemaFactory,
  translationsFactory,
  selectUiSchemaFactory,
  confSchemaFactory,
  widgetsFactory,
  translationUiFactory,
} from ':/tests/mocks/factories';
import VernaJSONSchemaType from ':/types/rjsf';

describe('schema translations', () => {
  const VernaSuspenseWrapper = ({
    configSchema,
    intl,
    locale,
    schema,
    uiSchema,
    widgets,
  }: {
    configSchema?: VernaJSONSchemaType;
    intl?: ResolvedIntlConfig;
    locale?: string;
    schema: VernaJSONSchemaType;
    uiSchema: UiSchema;
    widgets?: WidgetsType;
  }) => {
    return (
      <Suspense fallback="Loading...">
        <VernaProvider
          isEditor
          configSchema={configSchema}
          defaultWidgets={widgets}
          intl={intl}
          locale={locale}
          defaultSchema={{
            formSchema: schema,
            translationSchema: translationsFactory(),
            uiSchema: uiSchema,
          }}
        >
          <div data-testid="wrapper">
            <VernaForm />
          </div>
        </VernaProvider>
      </Suspense>
    );
  };

  it('should translate the entire schema in default locale en', async () => {
    render(
      <VernaSuspenseWrapper
        locale="en-US"
        schema={selectSchemaFactory()}
        uiSchema={selectUiSchemaFactory()}
        widgets={widgetsFactory()}
      />,
    );

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Check that no translation key are displayed, those always start by root
    // and have the layout as ids in the schema
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    screen.getByRole('group', { name: 'A registration form' });
    screen.getByText('Registration form description');
    screen.getByRole('group', { name: 'First section' });
  });

  it('should translate the entire schema in locale fr', async () => {
    render(
      <VernaSuspenseWrapper
        locale="fr-FR"
        schema={selectSchemaFactory()}
        uiSchema={selectUiSchemaFactory()}
        widgets={widgetsFactory()}
      />,
    );
    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    screen.getByRole('group', { name: "Un formulaire d'inscription" });
    screen.getByText("Description du formulaire d'inscription");
    screen.getByRole('group', { name: 'Première section' });
  });

  it('should translate the "enum" option in en', async () => {
    render(
      <VernaSuspenseWrapper
        configSchema={confSchemaFactory()}
        locale="en-US"
        schema={selectSchemaFactory()}
        uiSchema={selectUiSchemaFactory()}
        widgets={widgetsFactory()}
      />,
    );
    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters of the Select
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    // Check that option panel is open
    await screen.getAllByRole('group', { name: 'Options' });

    // Check that enums values are displayed
    screen.getByText('Option 0');
    screen.getByText('Option 1');

    // change the value of the first enum
    const $newInputs = screen.getAllByRole('textbox', {});
    await userEvent.clear($newInputs[2]);
    await userEvent.type($newInputs[2], 'Option 0 edited');

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    const $addButtons = screen.getAllByRole('textbox', {});
    await userEvent.clear($addButtons[4]);
    await userEvent.type($addButtons[4], 'Option 2');

    // Save parameters
    screen.getByRole('button', { name: 'save' }).click();

    // Open parameters again
    const $parameterButtons2 = screen.getAllByRole('button', { name: 'Parameters' });
    await userEvent.click($parameterButtons2[2]);

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = await screen.findAllByRole('textbox', {});
    expect($inputs[2]).toHaveValue('Option 0 edited');
    expect($inputs[3]).toHaveValue('Option 1');
    expect($inputs[4]).toHaveValue('Option 2');
  });

  it('should translate the "items" option in en', async () => {
    render(
      <VernaSuspenseWrapper
        configSchema={confSchemaFactory()}
        locale="en-US"
        schema={checkBoxesSchemaFactory()}
        uiSchema={checkBoxesUiSchemaFactory()}
      />,
    );
    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters of the Select
    const $parameterButtons = screen.getAllByRole('button', { name: 'Parameters' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    // Check that option panel is open
    const options = await screen.findByRole('group', { name: 'Options' });
    expect(options).toBeInTheDocument();

    // Check that enums values are displayed
    screen.getByText('Checkbox 0');
    screen.getByText('Checkbox 1');

    // change the value of the first item
    const $newInputs = screen.getAllByRole('textbox', {});
    await userEvent.clear($newInputs[2]);
    await userEvent.type($newInputs[2], 'Checkbox 0 edited');

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    const $addButtons = screen.getAllByRole('textbox', {});
    await userEvent.clear($addButtons[4]);
    await userEvent.type($addButtons[4], 'Checkbox 2');

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
    expect($inputs[2]).toHaveValue('Checkbox 0 edited');
    expect($inputs[3]).toHaveValue('Checkbox 1');
    expect($inputs[4]).toHaveValue('Checkbox 2');
  });

  it('should translate the "items" option in fr', async () => {
    const translationUi = translationUiFactory();

    const intl = createIntl({
      locale: 'fr-FR',
      messages: translationUi,
    });

    render(
      <IntlProvider locale="fr-FR">
        <VernaSuspenseWrapper
          configSchema={confSchemaFactory()}
          intl={intl}
          schema={checkBoxesSchemaFactory()}
          uiSchema={checkBoxesUiSchemaFactory()}
        />
      </IntlProvider>,
    );
    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters of the Select
    const $parameterButtons = screen.getAllByRole('button', { name: 'Paramètres' });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    // Check that no translation key are displayed
    expect(screen.queryAllByText('/root.*/')).toHaveLength(0);

    // Check that option panel is open
    const options = await screen.findByRole('group', { name: 'Options avancées' });
    expect(options).toBeInTheDocument();

    // Check that enums values are displayed
    screen.getByText('Case à cocher 0');
    screen.getByText('Case à cocher 1');

    // change the value of the first item
    const $newInputs = screen.getAllByRole('textbox', {});
    await userEvent.clear($newInputs[2]);
    await userEvent.type($newInputs[2], 'Case à cocher 0 éditée');

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    const $addButtons = screen.getAllByRole('textbox', {});
    await userEvent.clear($addButtons[4]);
    await userEvent.type($addButtons[4], 'Case à cocher 2');

    // Save parameters
    screen.getByRole('button', { name: 'Sauvegarder' }).click();

    // Open parameters again
    const $parameterButtons2 = screen.getAllByRole('button', { name: 'Paramètres' });
    expect($parameterButtons2).toHaveLength(3);
    await userEvent.click($parameterButtons2[2]);

    // Check that the previous options are updated correctly
    // Nb: those options are not cached, it's checking defaultSchema & defaultUiSchema
    //     on each opening
    const $inputs = await screen.findAllByRole('textbox', {});
    expect($inputs[2]).toHaveValue('Case à cocher 0 éditée');
    expect($inputs[3]).toHaveValue('Case à cocher 1');
    expect($inputs[4]).toHaveValue('Case à cocher 2');
  });

  it('should display the translation key if no translation is found', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(noop);
    render(
      <VernaSuspenseWrapper
        configSchema={confSchemaFactory()}
        locale="de-DE"
        schema={checkBoxesSchemaFactory()}
        uiSchema={checkBoxesUiSchemaFactory()}
      />,
    );

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Open parameters of the Select
    const $parameterButtons = screen.getAllByRole('button', {
      name: 'Parameters',
    });
    expect($parameterButtons).toHaveLength(3);
    await userEvent.click($parameterButtons[2]);

    // As translation has not been found, the translation key should be displayed
    screen.getByText('root_testSection_checkboxes_items_0');
    screen.getByText('root_testSection_checkboxes_items_1');
    expect(errorSpy).toHaveBeenCalled();
  });
});
