import _ from 'lodash';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { VernaSchemaType } from ':/types/rjsf';
import { removeTranslations } from ':/utils/schema/actions/translations';

/**
 * This action can remove any property in the schema and its presence in some parts of the
 * uiSchema such as in the ui:order
 *
 * @param schema current state of schema
 * @param id of the property to remove
 */
export function removeProperty(schema: VernaSchemaType, id: string): VernaSchemaType {
  const newSchema = _.cloneDeep(schema);
  const path = id.split(RJSF_ID_SEPARATOR);
  const propertyName = path[path.length - 1];
  const properties =
    path.length === 2
      ? newSchema.formSchema?.properties
      : newSchema.formSchema?.properties?.[path[1]]?.properties;
  if (!properties) throw Error("Error, can't access element to delete");

  // If property has sub properties, it will remove their translations
  if (properties[propertyName].properties) {
    Object.keys(properties[propertyName].properties!).forEach((key) => {
      newSchema.translationSchema = removeTranslations(newSchema, [
        properties[propertyName].properties?.[key]?.title,
        properties[propertyName].properties?.[key]?.description,
      ]).translationSchema;
    });
  }

  // Removing its own translation keys
  newSchema.translationSchema = removeTranslations(newSchema, [
    properties[propertyName]?.title,
    properties[propertyName]?.description,
  ]).translationSchema;

  delete properties[propertyName];

  // Removing property traces in UiSchema
  if (newSchema.uiSchema) {
    if (path.length === 2) {
      newSchema.uiSchema['ui:order'] = newSchema.uiSchema['ui:order']?.filter(
        (key: string) => key !== propertyName,
      );
      delete newSchema.uiSchema?.[propertyName];
    } else {
      newSchema.uiSchema[path[1]]['ui:order'] = newSchema.uiSchema[path[1]]['ui:order'].filter(
        (key: string) => key !== propertyName,
      );
      delete newSchema.uiSchema?.[path[1]]?.[propertyName];
    }
  }

  return newSchema;
}
