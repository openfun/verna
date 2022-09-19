import _ from 'lodash';
import { RJSF_ID_SEPARATOR } from ':/settings';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';

/**
 * This action is used to update properties informations such as title or description
 * It must NOT be used to add new sections or widgets
 *
 * @param schema initial schema
 * @param schemaUpdates schema infos to merge
 */
export function updateSchema(schema: VernaSchemaType, schemaUpdates: VernaSchemaType) {
  return _.merge(_.cloneDeep(schema), schemaUpdates);
}

/**
 * This action will replace entirely a widget by the widget properties given in parameter
 * It may be used rather than updateSchema for the need of deleting properties in the widget
 * For a use case example look the tests of this function
 *
 * @param schema initial schema
 * @param newWidgetInfos the new widget properties
 * @param id the id of the widget
 */
export function updateWidget(
  schema: VernaSchemaType,
  newWidgetInfos: VernaJSONSchemaType,
  id: string,
) {
  const newSchema = _.cloneDeep(schema);
  const idParts = id.split(RJSF_ID_SEPARATOR);
  const property = newSchema.formSchema?.properties;

  if (idParts.length === 2 && property?.[idParts[1]]) {
    property[idParts[1]] = newWidgetInfos;
  } else if (idParts.length === 3 && property?.[idParts[1]]?.properties?.[idParts[2]]) {
    property[idParts[1]].properties![idParts[2]] = newWidgetInfos;
  } else {
    throw new Error('Error, updateWidget action of the reducer has incorrect arguments.');
  }
  return newSchema;
}
