import { render, screen } from '@testing-library/react';
import {
  schemaFactory,
  translationsFactory,
  uiSchemaFactory,
  widgetsFactory,
} from '../../tests/mocks/factories';
import VernaProvider from '.';
import VernaForm from '../../components/VernaForm';

describe('custom render components', () => {
  it('should overload render section component', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        Section={() => <h1>SECTION</h1>}
        defaultSchema={schemaFactory()}
        defaultUiSchema={uiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    screen.getByText('SECTION');
  });

  it('should overload render dropzone component', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        DropZone={() => <h1>DROPZONE</h1>}
        defaultSchema={schemaFactory()}
        defaultUiSchema={uiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    expect(screen.queryAllByRole('heading', { level: 1, name: 'DROPZONE' })).toHaveLength(2);
  });

  it('should overload render fieldTemplate component', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        FieldTemplate={() => <h1>FIELDTEMPLATE</h1>}
        defaultSchema={schemaFactory()}
        defaultUiSchema={uiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    screen.getByRole('heading', { level: 1, name: 'FIELDTEMPLATE' });
  });

  it('should overload render submit button component', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        SubmitButton={<h1>SUBMIT BUTTON</h1>}
        defaultSchema={schemaFactory()}
        defaultUiSchema={uiSchemaFactory()}
        defaultWidgets={widgetsFactory()}
        isEditor={false}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    screen.getByRole('heading', { name: 'SUBMIT BUTTON' });
  });
});
