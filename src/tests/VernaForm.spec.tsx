import { screen, render } from '@testing-library/react';
import VernaForm from '../index';
import _ from 'lodash';
import { VernaContextProvider } from '../context/VernaContextProvider';
import { getSchemaDefault } from './mocks/FormProps';

describe('VernaForm', () => {
  function clickOnLastAddInputButton() {
    _.last(
      screen.queryAllByRole('button', {
        name: 'Add an input',
      }) as HTMLElement[],
    )?.click();
  }

  it('should render a basic form', async () => {
    render(
      <VernaContextProvider isEditor defaultSchema={getSchemaDefault()}>
        <VernaForm />
      </VernaContextProvider>,
    );
    // - A fieldset legend should be displayed with form title
    screen.getByRole('group', { name: 'A registration form' });

    // - A paragraph with form description should be displayed
    screen.getByText('Desc registration form');

    // - The first section should be displayed
    screen.getByRole('group', { name: 'Sectiontest' });

    const $field1 = document.getElementById('root_testSection_field1') as HTMLInputElement;

    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('text');
  });

  it('should be able to add or remove sections and fields', async () => {
    render(
      <VernaContextProvider isEditor defaultSchema={getSchemaDefault()}>
        <VernaForm />
      </VernaContextProvider>,
    );

    // Add two sections
    screen.getByRole('button', { name: 'Add a section' }).click();

    _.last(
      screen.queryAllByRole('button', {
        name: 'Add a section',
      }) as HTMLElement[],
    )?.click();

    const $addFieldButtons1 = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons1).toHaveLength(3);

    // Add two input fields
    clickOnLastAddInputButton();
    clickOnLastAddInputButton();

    const $addFieldButtons2 = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons2).toHaveLength(4);

    const $addSectionButtons = screen.queryAllByRole('button', {
      name: 'Add a section',
    });
    expect($addSectionButtons).toHaveLength(3);
    screen.getByRole('button', { name: 'Submit' });

    // Delete every elements from top to bottom
    _.forEach(
      screen.queryAllByRole('button', {
        name: 'x',
      }) as HTMLElement[],
      (element) => element.click(),
    );

    const $deleteButtons = screen.queryAllByRole('button', { name: 'x' });
    expect($deleteButtons).toHaveLength(0);

    const $addSectionButtons2 = screen.queryAllByRole('button', {
      name: 'Add a section',
    });
    expect($addSectionButtons2).toHaveLength(1);

    const $addFieldButtons3 = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons3).toHaveLength(0);
  });

  it('should use selector parameter to query sub schema and render it', async () => {
    render(
      <VernaContextProvider
        isEditor
        defaultSchema={getSchemaDefault()}
        defaultSelector="testSection"
      >
        <VernaForm />
      </VernaContextProvider>,
    );

    // - A fieldset legend should not be displayed
    expect(screen.queryAllByRole('group', { name: 'A registration form' })).toHaveLength(0);

    // - The form description should not be displayed
    expect(screen.queryAllByText('Desc registration form')).toHaveLength(0);

    // - The first section should be displayed
    expect(screen.queryAllByRole('group', { name: 'Sectiontest' })).toHaveLength(1);

    // - A required text input First name should be displayed inside the only section
    const $field1 = document.getElementById('root_field1') as HTMLInputElement;
    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('text');
  });

  it('should use selector parameter to query sub schema and add or remove fields on it', async () => {
    render(
      <VernaContextProvider
        isEditor
        defaultSchema={getSchemaDefault()}
        defaultSelector="testSection"
      >
        <VernaForm />
      </VernaContextProvider>,
    );

    // Add two input fields
    clickOnLastAddInputButton();
    clickOnLastAddInputButton();

    const $addFieldButtons = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons).toHaveLength(3);

    // Delete every elements from top to bottom
    _.forEach(
      screen.queryAllByRole('button', {
        name: 'x',
      }) as HTMLElement[],
      (element) => element.click(),
    );
    const $deleteButtons = screen.queryAllByRole('button', { name: 'x' });
    expect($deleteButtons).toHaveLength(0);

    const $addFieldButtons3 = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons3).toHaveLength(1);
  });

  it('should not render add functionalities if isEditor is false', async () => {
    render(
      <VernaContextProvider defaultSchema={getSchemaDefault()}>
        <VernaForm />
      </VernaContextProvider>,
    );

    // - A fieldset legend should be displayed with form title
    screen.getByRole('group', { name: 'A registration form' });

    // - A paragraph with form description should be displayed
    screen.getByText('Desc registration form');

    // - The first section should be displayed
    screen.getByRole('group', { name: 'Sectiontest' });

    const $field1 = document.getElementById('root_testSection_field1') as HTMLInputElement;

    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('text');

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
