import _ from 'lodash';
import { defineMessages, type IntlShape } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { stringDefinition } from ':/templates';
import { VernaSchemaType } from ':/types/rjsf';
import { Maybe } from ':/types/utils';
import ShowCaseWidgetProps from ':/types/Widgets';
import { getSectionName, getWidgetName } from ':/utils';
import { addTranslations } from ':/utils/schema';

const messages = defineMessages({
  defaultWidgetTitle: {
    defaultMessage: 'Default widget title',
    description: 'The default name of a newly created widget',
    id: 'templates.defaultWidgetTitle',
  },
});

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
 * @param intl
 */
export function addWidget(
  schema: VernaSchemaType,
  id: string,
  widgetInfos: Maybe<ShowCaseWidgetProps>,
  intl?: IntlShape,
): VernaSchemaType {
  const newSchema = _.cloneDeep(schema);
  const newKey = uuidv4();
  const sectionName = getSectionName(id, widgetInfos?.isDroppedInSection);

  if (!newSchema.formSchema) newSchema.formSchema = {};
  if (!newSchema.translationSchema && intl) newSchema.translationSchema = { [intl.locale]: {} };

  const section = sectionName
    ? newSchema?.formSchema?.properties?.[sectionName]
    : newSchema.formSchema;

  if (!section)
    throw Error("Error, corrupted data in schema, widget id isn't corresponding to schema content");

  if (!section.properties) section.properties = {};
  section.properties[newKey] = stringDefinition(widgetInfos?.type);

  let newIdTitle = '';
  if (intl) {
    // Set default title for the new widget
    const idParts = sectionName
      ? ['root', sectionName, newKey, 'title']
      : ['root', newKey, 'title'];
    newIdTitle = idParts.join(RJSF_ID_SEPARATOR);
    newSchema.translationSchema = addTranslations(schema, {
      [intl.locale]: { [newIdTitle]: intl.formatMessage(messages.defaultWidgetTitle) },
    }).translationSchema;
  } else {
    newIdTitle = messages.defaultWidgetTitle.defaultMessage;
  }

  section.properties![newKey].title = newIdTitle;

  return {
    ...newSchema,
    uiSchema: addWidgetToUiSchema(schema, newKey, id, widgetInfos),
  };
}
