import type { AjvError } from '@rjsf/core';

export default function transformErrors(errors: AjvError[]): AjvError[] {
  return errors.map((error) => {
    if (error.name === 'minimum') {
      error.message = `Nop ! It must be ${error.params.comparison} to ${error.params.limit}`;
    }
    if (error.name === 'pattern') {
      error.message = 'Only digits are allowed';
    }
    return error;
  });
}
