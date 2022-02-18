import { screen, render } from '@testing-library/react';
import VernaForm from '.';

describe('VernaForm', () => {
  it('should render', async () => {
    render(<VernaForm />);

    // - A required text input First name should be displayed with a default value Richie
    screen.getByRole('group', { name: 'A registration form' });

    // - A required text input First name should be displayed with a default value Richie
    const $firstnameField = screen.getByRole('textbox', {
      name: 'First name *',
    }) as HTMLInputElement;
    expect($firstnameField.required).toEqual(true);
    expect($firstnameField.value).toEqual('Richie');

    // - A required text input First name should be displayed with a default value Richie
    const $lastnameField = screen.getByRole('textbox', { name: 'Last name *' }) as HTMLInputElement;
    expect($lastnameField.required).toEqual(true);

    const $phoneField = screen.getByRole('textbox', { name: 'Telephone' }) as HTMLInputElement;
    expect($phoneField.required).toEqual(false);

    screen.getByRole('button', { name: 'Submit' });
  });
});
