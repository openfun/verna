import { JSONSchema7 } from 'json-schema';
import type { UiSchema } from '@rjsf/core';

function genDefaultUiSchema(schema: JSONSchema7, uiSchema: UiSchema) {
  if (uiSchema['ui:order']) return uiSchema;
  const defaultUi: UiSchema = {
    ...uiSchema,
    'ui:order': Object.keys(schema.properties || {}),
  };
  Object.entries(schema.properties || {}).forEach(([key, prop]) => {
    const schemaElement = prop as JSONSchema7;
    if (schemaElement.properties) {
      defaultUi[key] = {
        ...uiSchema?.[key],
        'ui:order': Object.keys(schemaElement.properties || {}),
      };
    }
  });
  return defaultUi;
}

function getSelectedSchema(
  defaultSchema: JSONSchema7,
  defaultSelector: string | undefined,
): JSONSchema7 {
  if (defaultSelector && defaultSchema?.properties?.[defaultSelector]) {
    return defaultSchema.properties[defaultSelector] as JSONSchema7;
  }
  return defaultSchema;
}

function getSelectedUiSchema(
  defaultUiSchema: UiSchema,
  defaultSelector: string | undefined,
): UiSchema {
  if (defaultSelector && defaultUiSchema?.[defaultSelector]) {
    return defaultUiSchema[defaultSelector];
  }
  return defaultUiSchema;
}

function getDefaultValues(defaultValues: any, defaultSelector: string | undefined) {
  if (defaultSelector && defaultValues) return defaultValues[defaultSelector];
  return defaultValues;
}

export { genDefaultUiSchema, getSelectedSchema, getSelectedUiSchema, getDefaultValues };
