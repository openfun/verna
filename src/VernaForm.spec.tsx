import { screen, render } from '@testing-library/react';
import VernaForm from '.';

describe('VernaForm', () => {
  it('should render', async () => {
    render(<VernaForm />);

    // - A fieldset legend should be displayed with form title
    screen.getByRole('group', { name: 'A registration form' });

    // - A paragraph with form description should be displayed
    screen.getByText('A simple form example.');

    // - A required text input First name should be displayed with a default value Richie
    const $firstnameField = screen.getByRole('textbox', {
      name: 'First name *',
    }) as HTMLInputElement;
    expect($firstnameField.required).toEqual(true);
    expect($firstnameField.value).toEqual('Richie');

    // - A required text input Last name should be displayed with no default value
    const $lastnameField = screen.getByRole('textbox', { name: 'Last name *' }) as HTMLInputElement;
    expect($lastnameField.required).toEqual(true);
    expect($lastnameField.value).toEqual('');

    // - A not required text input Phone should be displayed with no default value
    const $phoneField = screen.getByRole('textbox', { name: 'Phone' }) as HTMLInputElement;
    expect($phoneField.required).toEqual(false);
    expect($phoneField.value).toEqual('');

    screen.getByRole('button', { name: 'Submit' });
  });
});
