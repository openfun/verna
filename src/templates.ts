import { JSONSchema7Definition, JSONSchema7TypeName } from 'json-schema';
import Section from './widgets/Section';

const stringDefinition = (
  title: string,
  type: JSONSchema7TypeName = 'string',
): JSONSchema7Definition => ({
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
