import { JSONSchema7Definition, JSONSchema7TypeName } from 'json-schema';
import Section from '../Widgets/Section';

const stringDefinition = (
  title: string,
  type: JSONSchema7TypeName = 'string',
): JSONSchema7Definition => ({
  enum: type === 'string' ? [' '] : undefined,
  title,
  type,
});

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
