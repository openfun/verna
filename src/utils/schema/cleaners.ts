import VernaJSONSchemaType from '../../types/rjsf';
import type { UiSchema } from '@rjsf/core';
import Section from '../../components/Fields/Section';

/**
 * Verify & return a UiSchema with a specified order object, so it doesn't stop the workflow of the
 * drag and drop feature
 *
 * @param schema
 * @param dirtyUiSchema
 */
function cleanUiSchema(schema: VernaJSONSchemaType, dirtyUiSchema: UiSchema) {
  // Add an overload on ui:ObjectFieldTemplate for every sections so it loads the custom section
  // render of Verna
  dirtyUiSchema['ui:ObjectFieldTemplate'] = Section;
  Object.keys(schema.properties || {}).forEach((key) => {
    dirtyUiSchema[key] = {
      ...dirtyUiSchema[key],
      'ui:ObjectFieldTemplate': Section,
    };
  });

  // If uiSchema looks valid, skip the data generation
  if (dirtyUiSchema['ui:order']) return dirtyUiSchema;

  // First, set ui:order at root level
  const uiSchema: UiSchema = {
    ...dirtyUiSchema,
    'ui:order': Object.keys(schema.properties || {}),
  };

  // Then set ui:order for each section
  Object.entries(schema.properties || {}).forEach(([key, prop]) => {
    const schemaElement = prop as VernaJSONSchemaType;
    uiSchema[key] = {
      ...uiSchema?.[key],
      'ui:order': Object.keys(schemaElement.properties || {}),
    };
  });
  return uiSchema;
}

export { cleanUiSchema };
