import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import VernaForm from ':/components/VernaForm';
import VernaToolbar from ':/components/VernaToolbar';
import VernaProvider from ':/providers/VernaProvider';
import { vernaSchemaFactory, widgetsFactory } from ':/tests/mocks/factories';
import ShowCaseWidgetProps from ':/types/Widgets';

describe('drag and drop', () => {
  it('should display the draggable fields', async () => {
    function ToolbarWidget(props: ShowCaseWidgetProps) {
      return <span>{props.widgetName}</span>;
    }

    render(
      <VernaToolbar>
        <ToolbarWidget type="string" widgetName="textwidget" />
        <ToolbarWidget type="number" widgetName="numberwidget" />
      </VernaToolbar>,
    );

    expect(screen.getByText('numberwidget').parentElement!.draggable).toBe(true);
    expect(screen.getByText('textwidget').parentElement!.draggable).toBe(true);
  });

  it('should add corresponding field on drop at position', async () => {
    render(
      <Suspense fallback="Loading...">
        <VernaProvider
          isEditor
          DropZone={() => <span>dropzone</span>}
          defaultSchema={vernaSchemaFactory()}
          defaultWidgets={widgetsFactory()}
          locale="en-US"
        >
          <div data-testid="wrapper">
            <VernaForm />
          </div>
        </VernaProvider>
      </Suspense>,
    );

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Confirm we start with 2 drop zones
    let $dropZones = screen.getAllByText('dropzone');
    expect($dropZones).toHaveLength(2);

    // Simulate the drop of a new widget of type string on the first dropzone
    fireEvent.drop($dropZones[0], {
      dataTransfer: {
        getData: () => 0,
        items: [
          {
            type: 'string',
            widgetName: 'textWidgetTest',
          },
        ],
        types: ['Object'],
      },
    });

    // We should now have 3 drop zones
    $dropZones = screen.getAllByText('dropzone');
    expect($dropZones).toHaveLength(3);

    // Check that the two fields are displayed, the new text input and
    // the initial number field
    screen.getByRole('textbox', {});
    screen.getByLabelText('First field');

    // Add a third text field below the number field
    fireEvent.drop($dropZones[2], {
      dataTransfer: {
        getData: () => 0,
        items: [
          {
            type: 'string',
            widgetName: 'textWidgetTest',
          },
        ],
        types: ['Object'],
      },
    });

    // Check that we have the 4 drop zones
    expect(screen.getAllByText('dropzone')).toHaveLength(4);

    // Check that we have the two added text fields and the initial field
    expect(screen.getAllByRole('textbox', {})).toHaveLength(2);
    screen.getByLabelText('First field');
  });
});
