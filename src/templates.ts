import { JSONSchema7TypeName } from 'json-schema';
import Section from './components/Fields/Section';
import VernaJSONSchemaType from './types/rjsf';

const stringDefinition = (type: JSONSchema7TypeName = 'string'): VernaJSONSchemaType => {
  const def: VernaJSONSchemaType = {
    type,
  };
  if (type === 'array') {
    def['items'] = { enum: [], type: 'string' };
    def['uniqueItems'] = true;
  }
  return def;
};

const sectionDefinition = (): VernaJSONSchemaType => ({
  properties: {},
  type: 'object',
});

const defaultWidgetProps: { [key: string]: VernaJSONSchemaType } = {
  description: {
    type: 'string',
  },
  title: {
    type: 'string',
  },
};

const defaultVernaWidgets = {};

const defaultObjectFieldTemplate = {
  section: Section,
};

export {
  stringDefinition,
  sectionDefinition,
  defaultVernaWidgets,
  defaultObjectFieldTemplate,
  defaultWidgetProps,
};
