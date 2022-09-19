import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { stringDefinition } from ':/templates';
import { VernaSchemaType } from ':/types/rjsf';
import ShowCaseWidgetProps from ':/types/Widgets';
import { getSectionName, getWidgetName } from ':/utils';

function addWidgetToUiSchema(
  schema: VernaSchemaType,
  newKey: string,
  id: string,
  widgetInfos?: ShowCaseWidgetProps,
) {
  const newUiSchema = _.cloneDeep(schema.uiSchema || {});
  const currentField = getWidgetName(id);
  let currentSection = getSectionName(id);
  if (!currentSection && widgetInfos?.isDroppedInSection && id !== 'root') {
    currentSection = id.split(RJSF_ID_SEPARATOR).pop();
  }

  // If there is no currentSection it means the widget is a direct child of root
  const uiSchemaSection = currentSection ? newUiSchema?.[currentSection] : newUiSchema;

  // If there are no ui:order we create one, otherwise we update it
  if (!uiSchemaSection?.['ui:order']) {
    uiSchemaSection['ui:order'] = [newKey];
  } else {
    const previousWidgetIndex = uiSchemaSection['ui:order'].findIndex(
      (key: string) => key === currentField,
    );
    uiSchemaSection['ui:order'].splice(previousWidgetIndex + 1, 0, newKey);
  }
  uiSchemaSection[newKey] = {
    'ui:widget': widgetInfos?.widgetName,
  };

  return newUiSchema;
}

/**
 * Action of the reducer that will add a widget corresponding to the type given in parameter
 *
 * @param schema state of the schemaForm
 * @param id of the element on the top of the drop zone either a section or a widget
 * @param widgetInfos info on the new widget to add, shaped on the onDrop data matching the
 * ShowCaseWidgetProps layout
 */
export function addWidget(
  schema: VernaSchemaType,
  id: string,
  widgetInfos?: ShowCaseWidgetProps,
): VernaSchemaType {
  const newSchema = _.cloneDeep(schema.formSchema);
  const newKey = uuidv4();
  const sectionName = getSectionName(id, widgetInfos?.isDroppedInSection);
  const section = sectionName ? newSchema?.properties?.[sectionName] : newSchema;

  if (!section)
    throw Error("Error, corrupted data in schema, widget id isn't corresponding to schema content");

  if (!section.properties) section.properties = {};
  section.properties[newKey] = stringDefinition(widgetInfos?.type);

  return {
    formSchema: newSchema,
    translationSchema: schema.translationSchema,
    uiSchema: addWidgetToUiSchema(schema, newKey, id, widgetInfos),
  };
}
