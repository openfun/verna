import type { AjvError } from '@rjsf/core';

export default function transformErrors(errors: AjvError[]): AjvError[] {
  return errors.map((error) => {
    if (error.name === 'minimum') {
      error.message = `It's not right, your value must ${error.params.comparison} ${error.params.limit} ! Try something else`;
    }
    if (error.name === 'pattern') {
      error.message = 'Only digits are allowed';
    }
    console.log(error);
    return error;
  });
}
