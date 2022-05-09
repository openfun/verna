import type { UiSchema } from '@rjsf/core';
import VernaJSONSchemaType from '../../types/rjsf';

/**
 * Set the JSONSchema used by the library, if there is a selector specified it will return only the
 * part needed
 * */
function getSelectedSchema(
  defaultSchema: VernaJSONSchemaType,
  defaultSelector: string | undefined,
): VernaJSONSchemaType {
  if (defaultSelector && defaultSchema?.properties?.[defaultSelector]) {
    return defaultSchema.properties[defaultSelector] as VernaJSONSchemaType;
  }
  return defaultSchema;
}

/**
 * TODO: explain the purpose of this method
 *
 * @param defaultUiSchema
 * @param defaultSelector
 */
function getSelectedUiSchema(
  defaultUiSchema: UiSchema,
  defaultSelector: string | undefined,
): UiSchema {
  if (defaultSelector && defaultUiSchema?.[defaultSelector]) {
    return defaultUiSchema[defaultSelector];
  }
  return defaultUiSchema;
}

/**
 * TODO: explain the purpose of this method
 *
 * @param defaultValues
 * @param defaultSelector
 */
function getSelectedDefaultValues(defaultValues: any, defaultSelector: string | undefined) {
  if (defaultSelector && defaultValues) return defaultValues[defaultSelector];
  return defaultValues;
}

export { getSelectedSchema, getSelectedUiSchema, getSelectedDefaultValues };
