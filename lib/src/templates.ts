import { JSONSchema7TypeName } from 'json-schema';
import VernaJSONSchemaType from ':/types/rjsf';

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
  title: {
    type: 'string',
  },
};

const sectionParametersSchema = (): VernaJSONSchemaType => ({
  properties: {
    description: {
      title: 'description',
      type: 'string',
    },
    title: {
      title: 'title',
      type: 'string',
    },
  },
  type: 'object',
});

const defaultVernaWidgets = {};

export {
  stringDefinition,
  sectionDefinition,
  defaultVernaWidgets,
  defaultWidgetProps,
  sectionParametersSchema,
};
