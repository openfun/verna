import { JSONSchema7Definition } from 'json-schema';

const stringDefinition = (title: string): JSONSchema7Definition => ({
  title: title,
  type: 'string',
});

const sectionDefinition = (title: string): JSONSchema7Definition => ({
  title: title,
  type: 'object',
  properties: {},
});

export { stringDefinition, sectionDefinition };
