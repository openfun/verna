import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import VernaForm from ':/components/VernaForm';
import VernaProvider, { WidgetsType } from ':/providers/VernaProvider';
import { vernaSchemaFactory, widgetsFactory } from ':/tests/mocks/factories';
import { resolvePromisesOneByOne } from ':/tests/utils';

describe('VernaForm', () => {
  const VernaSuspenseWrapper = ({
    isEditor,
    selector,
  }: {
    selector?: string;
    isEditor?: boolean;
    widgets?: WidgetsType;
  }) => {
    return (
      <Suspense fallback="Loading...">
        <VernaProvider
          defaultSchema={vernaSchemaFactory()}
          defaultSelector={selector}
          defaultWidgets={widgetsFactory()}
          isEditor={isEditor}
        >
          <div data-testid="wrapper">
            <VernaForm />
          </div>
        </VernaProvider>
      </Suspense>
    );
  };

  it('should render a basic form', async () => {
    render(<VernaSuspenseWrapper />);
    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // - A fieldset legend should be displayed with form title
    screen.getByRole('group', { name: 'A registration form' });

    // - A paragraph with form description should be displayed
    screen.getByText('Registration form description');

    // - The first section should be displayed
    screen.getByRole('group', { name: 'First section' });

    const $field1 = document.getElementById('root_testSection_field1') as HTMLInputElement;

    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('number');
  });

  it('should be able to add or remove sections and fields', async () => {
    render(<VernaSuspenseWrapper isEditor />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // Add two sections
    await userEvent.click(screen.getByRole('button', { name: 'Add a section' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add a section' }));

    const $parametersButton = await screen.findAllByRole('button', {
      name: 'Parameters',
    });
    expect($parametersButton).toHaveLength(5);

    screen.getByRole('button', { name: 'Submit' });

    // Delete every element from top to bottom
    await resolvePromisesOneByOne(
      screen.queryAllByRole('button', {
        name: 'x',
      }),
      (element: HTMLElement) => userEvent.click(element),
    );

    const $deleteButtons = screen.queryAllByRole('button', { name: 'x' });
    expect($deleteButtons).toHaveLength(0);

    const $addSectionButtons2 = screen.queryAllByRole('button', {
      name: 'Add a section',
    });
    expect($addSectionButtons2).toHaveLength(1);

    const $addFieldButtons = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons).toHaveLength(0);
  });

  it('should use selector parameter to query sub schema and render it', async () => {
    render(<VernaSuspenseWrapper isEditor selector="testSection" />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // - A fieldset legend should not be displayed
    expect(
      screen.queryByRole('group', { name: 'Registration form description' }),
    ).not.toBeInTheDocument();

    // - The form description should not be displayed
    expect(screen.queryByText('Desc registration form')).not.toBeInTheDocument();

    // - The first section should be displayed
    screen.getByRole('group', { name: 'First section' });

    // - A required text input First name should be displayed inside the only section
    const $field1 = document.getElementById('root_field1') as HTMLInputElement;
    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('number');
  });

  it('should use a selector to query sub schema and remove fields on it', async () => {
    render(<VernaSuspenseWrapper isEditor selector="testSection" />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });
    // Delete the field
    // eslint-disable-next-line compat/compat

    await userEvent.click(
      screen.queryAllByRole('button', {
        name: 'x',
      })[0],
    );

    // - All delete buttons should have been removed
    expect(screen.queryByRole('button', { name: 'x' })).not.toBeInTheDocument();
  });

  it('should not render add functionalities if isEditor is false', async () => {
    render(<VernaSuspenseWrapper />);

    // Wait that the form is rendered...
    await waitFor(() => {
      expect(screen.queryByTestId('wrapper')).toBeInTheDocument();
    });

    // - A fieldset legend should be displayed with form title
    screen.getByRole('group', { name: 'A registration form' });

    // - A paragraph with form description should be displayed
    screen.getByText('Registration form description');

    // - The first section should be displayed
    screen.getByRole('group', { name: 'First section' });

    const $field1 = document.getElementById('root_testSection_field1') as HTMLInputElement;

    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('number');

    const $addFieldButtons = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons).toHaveLength(0);

    const $addSectionButtons2 = screen.queryAllByRole('button', {
      name: 'Add a section',
    });
    expect($addSectionButtons2).toHaveLength(0);
  });
});
