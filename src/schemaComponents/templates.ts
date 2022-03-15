import { JSONSchema7Definition } from 'json-schema';

const stringDefinition = (title: string): JSONSchema7Definition => ({
  title: title,
  type: 'string',
});

const sectionDefinition = (title: string): JSONSchema7Definition => ({
  properties: {},
  title: title,
  type: 'object',
});

export { stringDefinition, sectionDefinition };
