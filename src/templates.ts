import { JSONSchema7Definition, JSONSchema7TypeName } from 'json-schema';
import Section from './widgets/Section';

const stringDefinition = (
  title: string,
  type: JSONSchema7TypeName = 'string',
): JSONSchema7Definition => {
  const def: JSONSchema7Definition = {
    title,
    type,
  };
  if (type === 'array') {
    def['items'] = { enum: [], type: 'string' };
    def['uniqueItems'] = true;
  }
  return def;
};

const sectionDefinition = (title: string): JSONSchema7Definition => ({
  properties: {},
  title: title,
  type: 'object',
});

const defaultVernaWidgets = {};

const defaultObjectFieldTemplate = {
  section: Section,
};

export { stringDefinition, sectionDefinition, defaultVernaWidgets, defaultObjectFieldTemplate };
