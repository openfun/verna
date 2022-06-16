import { screen, render, waitFor } from '@testing-library/react';
import _ from 'lodash';
import userEvent from '@testing-library/user-event';
import VernaProvider from '../../providers/VernaProvider';
import { schemaFactory, translationsFactory } from '../../tests/mocks/factories';
import VernaForm from '../VernaForm';
import { resolvePromisesOneByOne } from '../../tests/utils';

describe('VernaForm', () => {
  async function clickOnLastAddInputButton() {
    const buttons = await screen.findAllByRole('button', {
      name: 'Add an input',
    });
    await userEvent.click(_.last(buttons)!);
  }

  it('should render a basic form', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        defaultSchema={schemaFactory()}
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );
    // - A fieldset legend should be displayed with form title
    screen.getByRole('group', { name: translations.en.root_title });

    // - A paragraph with form description should be displayed
    screen.getByText(translations.en.root_description);

    // - The first section should be displayed
    screen.getByRole('group', { name: translations.en.root_testSection_title });

    const $field1 = document.getElementById('root_testSection_field1') as HTMLInputElement;

    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('text');
  });

  it('should be able to add or remove sections and fields', async () => {
    render(
      <VernaProvider
        isEditor
        defaultSchema={schemaFactory()}
        locale="en"
        translations={translationsFactory()}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // Add two sections
    await userEvent.click(screen.getByRole('button', { name: 'Add a section' }));
    await userEvent.click(
      _.last(
        screen.getAllByRole('button', {
          name: 'Add a section',
        }) as HTMLElement[],
      )!,
    );

    await waitFor(() => {
      const $addFieldButtons = screen.queryAllByRole('button', {
        name: 'Add an input',
      });
      expect($addFieldButtons).toHaveLength(3);
    });

    // Add two input fields
    await clickOnLastAddInputButton();
    await clickOnLastAddInputButton();

    const $parametersButton = await screen.findAllByRole('button', {
      name: 'Parameters',
    });
    expect($parametersButton).toHaveLength(3);

    const $addSectionButtons = screen.queryAllByRole('button', {
      name: 'Add a section',
    });
    expect($addSectionButtons).toHaveLength(3);
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
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        defaultSchema={schemaFactory()}
        defaultSelector="testSection"
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // - A fieldset legend should not be displayed
    expect(screen.queryAllByRole('group', { name: translations.en.root_title })).toHaveLength(0);

    // - The form description should not be displayed
    expect(screen.queryAllByText('Desc registration form')).toHaveLength(0);

    // - The first section should be displayed
    expect(
      screen.queryAllByRole('group', { name: translations.en.root_testSection_title }),
    ).toHaveLength(1);

    // - A required text input First name should be displayed inside the only section
    const $field1 = document.getElementById('root_field1') as HTMLInputElement;
    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('text');
  });

  it('should use a selector to query sub schema and add or remove fields on it', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider
        isEditor
        defaultSchema={schemaFactory()}
        defaultSelector="testSection"
        locale="en"
        translations={translations}
      >
        <VernaForm />
      </VernaProvider>,
    );

    // Add two input fields
    await clickOnLastAddInputButton();
    await clickOnLastAddInputButton();

    const $addFieldButtons = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons).toHaveLength(3);

    // Delete every element from top to bottom
    // eslint-disable-next-line compat/compat
    await userEvent.click(
      screen.queryAllByRole('button', {
        name: 'x',
      })[0],
    );
    await userEvent.click(
      screen.queryAllByRole('button', {
        name: 'x',
      })[0],
    );
    await userEvent.click(
      screen.queryAllByRole('button', {
        name: 'x',
      })[0],
    );
    await userEvent.click(
      screen.queryAllByRole('button', {
        name: 'x',
      })[0],
    );

    await waitFor(() => {
      const $deleteButtons = screen.queryAllByRole('button', { name: 'x' });
      expect($deleteButtons).toHaveLength(0);
    });

    const $addFieldButtons3 = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons3).toHaveLength(1);
  });

  it('should not render add functionalities if isEditor is false', async () => {
    const translations = translationsFactory();

    render(
      <VernaProvider defaultSchema={schemaFactory()} locale="en" translations={translations}>
        <VernaForm />
      </VernaProvider>,
    );

    // - A fieldset legend should be displayed with form title
    screen.getByRole('group', { name: translations.en.root_title });

    // - A paragraph with form description should be displayed
    screen.getByText(translations.en.root_description);

    // - The first section should be displayed
    screen.getByRole('group', { name: translations.en.root_testSection_title });

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
