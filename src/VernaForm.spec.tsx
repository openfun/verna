import { screen, render } from '@testing-library/react';
import VernaForm from '.';
import { JSONSchema7 } from 'json-schema';
import _ from 'lodash';
import { VernaContextProvider } from './VernaContextProvider';

const schemaDefault: JSONSchema7 = {
  title: 'A registration form',
  description: 'Desc registration form',
  type: 'object',
  properties: {
    testSection: {
      type: 'object',
      title: 'Sectiontest',
      properties: {
        champ1: {
          type: 'string',
          title: 'Field name 1',
          propertyNames: true,
        },
      },
    },
  },
};

describe('VernaForm', () => {
  it('should render', async () => {
    render(
      <VernaContextProvider defaultSchema={schemaDefault}>
        <VernaForm />
      </VernaContextProvider>,
    );

    // - A fieldset legend should be displayed with form title
    screen.getByRole('group', { name: 'A registration form' });

    // - A paragraph with form description should be displayed
    screen.getByText('Desc registration form');

    // - The first section should be displayed
    screen.getByRole('group', { name: 'Sectiontest' });

    const $field1 = document.getElementById('root_testSection_champ1') as HTMLInputElement;

    expect($field1).toBeInstanceOf(HTMLInputElement);
    expect($field1.type).toBe('text');

    // Add two sections
    screen
      .getByRole('button', {
        name: 'Add a section',
      })
      .click();
    _.last(
      (await screen.findAllByRole('button', {
        name: 'Add a section',
      })) as HTMLElement[],
    )?.click();

    const $addFieldButtons1 = await screen.findAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons1).toHaveLength(3);

    // Add two input fields
    _.last(
      (await screen.findAllByRole('button', {
        name: 'Add an input',
      })) as HTMLElement[],
    )?.click();
    _.last(
      (await screen.findAllByRole('button', {
        name: 'Add an input',
      })) as HTMLElement[],
    )?.click();

    const $addFieldButtons2 = await screen.findAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons2).toHaveLength(4);

    const $addSectionButtons = await screen.findAllByRole('button', {
      name: 'Add a section',
    });
    expect($addSectionButtons).toHaveLength(3);

    // Delete every elements from top to bottom
    screen.getByRole('button', { name: 'Submit' });
    _.forEach(
      (await screen.findAllByRole('button', {
        name: 'x',
      })) as HTMLElement[],
      (element) => element.click(),
    );
    const $deleteButtons = screen.queryAllByRole('button', { name: 'x' });
    expect($deleteButtons).toHaveLength(0);

    const $addSectionButtons2 = await screen.findAllByRole('button', {
      name: 'Add a section',
    });
    expect($addSectionButtons2).toHaveLength(1);

    const $addFieldButtons3 = screen.queryAllByRole('button', {
      name: 'Add an input',
    });
    expect($addFieldButtons3).toHaveLength(0);
  });
});
