import { JSONSchema7TypeName } from 'json-schema';
import Section from './components/Fields/Section';
import VernaJSONSchemaType from './types/rjsf';

const stringDefinition = (
  title: string,
  type: JSONSchema7TypeName = 'string',
): VernaJSONSchemaType => {
  const def: VernaJSONSchemaType = {
    title,
    type,
  };
  if (type === 'array') {
    def['items'] = { enum: [], type: 'string' };
    def['uniqueItems'] = true;
  }
  return def;
};

const sectionDefinition = (title: string): VernaJSONSchemaType => ({
  properties: {},
  title: title,
  type: 'object',
});

const defaultVernaWidgets = {};

const defaultObjectFieldTemplate = {
  section: Section,
};

export { stringDefinition, sectionDefinition, defaultVernaWidgets, defaultObjectFieldTemplate };
