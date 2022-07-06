import type { UiSchema } from '@rjsf/core';
import VernaJSONSchemaType from '../../types/rjsf';

/**
 * Get the JSONSchema used by the library, if there is a selector specified it will return only the
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
 * Get the UiSchema used by the library, if there is a selector specified it will return only the
 * part needed
 * */
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
 * Get the default values used by the library, if there is a selector specified it will
 * return only the part needed
 * */
function getSelectedDefaultValues(defaultValues: any, defaultSelector: string | undefined) {
  if (defaultSelector && defaultValues) return defaultValues[defaultSelector];
  return defaultValues;
}

export { getSelectedSchema, getSelectedUiSchema, getSelectedDefaultValues };
