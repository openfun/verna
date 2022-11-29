import { useVerna, VernaForm, VernaProvider } from '@openfun/verna';
import { VernaSchemaType } from '@openfun/verna/dist/types/rjsf';
import { Maybe } from '@openfun/verna/dist/types/utils';
import * as factories from '@openfun/verna/src/tests/mocks/factories';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { IntlProvider } from 'react-intl';
import AddQuestionModal from ':/components/Modal/AddQuestionModal';

describe('AddQuestionModal', () => {
  let useVernaValue: Maybe<VernaSchemaType>;

  const UseVernaRenderer = () => {
    useVernaValue = useVerna().schema;
    return null;
  };

  const VernaSuspenseWrapper = ({ idParts }: { idParts: string[] }) => (
    <Suspense fallback={<span data-testid="suspense-fallback" />}>
      <IntlProvider locale="en-US">
        <VernaProvider
          isEditor
          defaultSchema={factories.vernaSchemaFactory()}
          defaultWidgets={factories.widgetsFactory()}
          locale="en-US"
          configSchema={{
            properties: {
              selectWidget: {
                properties: {
                  enum: {
                    additionalItems: {
                      type: 'boolean',
                    },
                    items: {
                      type: 'string',
                    },
                    type: 'array',
                  },
                },
              },
            },
          }}
        >
          <VernaForm />
          <AddQuestionModal idParts={idParts} setIsNewPollModalVisible={() => undefined} />
          <UseVernaRenderer />
        </VernaProvider>
      </IntlProvider>
    </Suspense>
  );

  beforeEach(() => {
    useVernaValue = undefined;
  });

  it('should be able to add a widget from the list with correct type and name', async () => {
    render(<VernaSuspenseWrapper idParts={['root', 'testSection']} />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('suspense-fallback')).toBeNull();
    });

    // Check that the modal is rendered
    expect(screen.getByText('Select a type of question to add')).toBeInTheDocument();

    // Add a Multiple choice question field
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Open Drop' }));
      await userEvent.click(screen.getByRole('option', { name: 'Single choice question' }));
      await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    });

    // Open parameters of the newly created field and add an option
    await act(async () => {
      await userEvent.click(screen.getAllByRole('button', { name: 'Parameters' })[3]);
      await userEvent.click(screen.getAllByRole('button', { name: 'Add' })[0]);
      await userEvent.type(screen.getAllByRole('textbox', {})[1], 'test');
    });

    // Save parameters
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'save' }));
    });

    // Reopen parameters
    await act(async () => {
      await userEvent.click(screen.getAllByRole('button', { name: 'Parameters' })[3]);
    });

    expect(screen.getAllByRole('textbox', {})[1]).toHaveValue('test');
  });

  it('should add the widget properly in the schema', async () => {
    render(<VernaSuspenseWrapper idParts={['root', 'testSection']} />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('suspense-fallback')).toBeNull();
    });

    // Add a Multiple choice question field
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Open Drop' }));
      await userEvent.click(screen.getByRole('option', { name: 'Single choice question' }));
      await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    });

    // Check that the newly created widget is well initialized
    const { formSchema, uiSchema } = useVernaValue!;
    const newWidgetId = uiSchema?.['testSection']['ui:order'].find(
      (widget: string) => widget !== 'field1',
    );
    expect(newWidgetId).toBeDefined();
    expect(uiSchema?.['testSection'][newWidgetId]).toEqual({ 'ui:widget': 'selectWidget' });
    expect(formSchema?.['properties']?.['testSection']?.['properties']?.[newWidgetId]?.type).toBe(
      'string',
    );
  });
});
