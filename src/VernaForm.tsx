import Form from '@rjsf/core';
import type { JSONSchema7 } from 'json-schema';

const schema: JSONSchema7 = {
  title: 'A registration form',
  description: 'A simple form example.',
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Richie',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
    },
  },
};

function VernaForm() {
  return <Form schema={schema} />;
}

export default VernaForm;
