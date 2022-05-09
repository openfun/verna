import { getWidgetName, getSectionName, makeid } from '../utils';
import { ObjectFieldTemplateType, VernaContextProps } from '../../providers/VernaProvider';
import { sectionDefinition, stringDefinition } from '../../templates';
import ShowCaseWidgetProps from '../../types/Widgets';

function addWidgetToUiSchemaWithSelector(
  verna: VernaContextProps,
  newKey: string,
  id: string,
  widgetName?: string,
) {
  const newUiSchema = { ...verna.uiSchema };
  const currentField = getWidgetName(id);

  if (newUiSchema['ui:order']) {
    const currentOrderIndex = newUiSchema['ui:order'].findIndex(
      (key: string) => key === currentField,
    );
    newUiSchema['ui:order'].splice(currentOrderIndex + 1, 0, newKey);
  } else {
    newUiSchema['ui:order'] = [newKey];
  }
  newUiSchema[newKey] = {
    'ui:widget': widgetName,
  };
  verna.setUiSchema(newUiSchema);
}

function addWidgetToUiSchemaWithoutSelector(
  verna: VernaContextProps,
  newKey: string,
  id: string,
  widgetName?: string,
) {
  const newUiSchema = { ...verna.uiSchema };
  const currentSection = getSectionName(id);
  const currentField = getWidgetName(id);
  if (!currentSection) return;
  if (newUiSchema?.[currentSection]?.['ui:order']) {
    const currentSectionIndex = verna.uiSchema[currentSection]['ui:order'].findIndex(
      (key: string) => key === currentField,
    );
    newUiSchema[currentSection]['ui:order'].splice(currentSectionIndex + 1, 0, newKey);
  } else {
    newUiSchema[currentSection] = { ...newUiSchema[currentSection] };
    newUiSchema[currentSection]['ui:order'] = [newKey];
  }
  if (newUiSchema?.[currentSection] && widgetName) {
    newUiSchema[currentSection][newKey] = {
      'ui:widget': widgetName,
    };
  }
  verna.setUiSchema(newUiSchema);
}

function addWidget(
  newKey: string,
  id: string,
  verna: VernaContextProps,
  widgetInfos?: ShowCaseWidgetProps,
) {
  // First update the schema
  const currentSection = getSectionName(id);
  const newSchema = { ...verna.schema };
  if (!currentSection) return;
  if (verna.selector) {
    if (newSchema.properties) {
      newSchema.properties[newKey] = stringDefinition(newKey, widgetInfos?.type);
    }
  } else {
    const section = newSchema.properties?.[currentSection] || {};
    if (section.properties) {
      section.properties[newKey] = stringDefinition(newKey, widgetInfos?.type);
    }
  }
  verna.setSchema(newSchema);

  // Then update the ui-schema
  if (verna.selector) {
    addWidgetToUiSchemaWithSelector(verna, newKey, id, widgetInfos?.widgetName);
  } else {
    addWidgetToUiSchemaWithoutSelector(verna, newKey, id, widgetInfos?.widgetName);
  }
}

function addSection(
  verna: VernaContextProps,
  id: string,
  objectFieldTemplate: ObjectFieldTemplateType,
) {
  const newSchema = { ...verna.schema };
  const newKey = makeid(10);
  if (newSchema.properties) {
    newSchema.properties[newKey] = sectionDefinition(newKey);
  }
  verna.setSchema(newSchema);
  const currentSection = getSectionName(id);
  const newUiSchema = { ...verna.uiSchema };
  if (newUiSchema['ui:order']) {
    const currentSectionIndex =
      newUiSchema['ui:order'].findIndex((key) => key === currentSection) || 0;
    newUiSchema['ui:order'].splice(currentSectionIndex + 1, 0, newKey);
    newUiSchema[newKey] = {
      'ui:ObjectFieldTemplate': objectFieldTemplate.section,
    };
    verna.setUiSchema(newUiSchema);
  }
}

export { addWidget, addSection };
