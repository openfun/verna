import { JSONSchema7, JSONSchema7TypeName } from 'json-schema';
import { getCurrentField, getCurrentSection, makeid } from '../utils';
import { ObjectFieldTemplateType, VernaContextProps } from './VernaContextProvider';
import { sectionDefinition, stringDefinition } from '../schemaComponents/templates';

function addItemToUiSchemaWithSelector(
  verna: VernaContextProps,
  newKey: string,
  id: string,
  widgetName?: string,
) {
  const newUiSchema = { ...verna.uiSchema };
  const currentField = getCurrentField(id);

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

function addItemToUiSchemaWithoutSelector(
  verna: VernaContextProps,
  newKey: string,
  id: string,
  widgetName?: string,
) {
  const newUiSchema = { ...verna.uiSchema };
  const currentSection = getCurrentSection(id);
  const currentField = getCurrentField(id);

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

function addItemToUiSchema(
  newKey: string,
  id: string,
  verna: VernaContextProps,
  widgetName?: string,
) {
  if (verna.selector) {
    addItemToUiSchemaWithSelector(verna, newKey, id, widgetName);
  } else {
    addItemToUiSchemaWithoutSelector(verna, newKey, id, widgetName);
  }
}

function addItemToSchema(
  newKey: string,
  id: string,
  verna: VernaContextProps,
  widgetType?: JSONSchema7TypeName,
) {
  const currentSection = getCurrentSection(id);
  const newSchema = { ...verna.schema };
  if (newSchema.properties) {
    if (verna.selector) {
      if (newSchema.properties) {
        newSchema.properties[newKey] = stringDefinition(newKey, widgetType);
      }
    } else {
      const section = newSchema.properties[currentSection] as JSONSchema7;
      if (section.properties) {
        section.properties[newKey] = stringDefinition(newKey, widgetType);
      }
    }
  }
  verna.setSchema(newSchema);
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
  const currentSection = getCurrentSection(id);
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

function removeItem(verna: VernaContextProps, id: string) {
  const currentSection = getCurrentSection(id);
  const currentField = getCurrentField(id);
  const newSchema = { ...verna.schema };
  const newUiSchema = { ...verna.uiSchema };
  if (verna.selector) {
    if (newSchema.properties) delete newSchema.properties[currentField];
    if (newUiSchema['ui:order']) {
      newUiSchema['ui:order'] = newUiSchema['ui:order'].filter(
        (key: string) => key !== currentField,
      );
    }
  } else {
    if (newSchema.properties) {
      const sectionProperties = newSchema.properties[currentSection] as JSONSchema7;
      if (sectionProperties.properties) {
        delete sectionProperties.properties[currentField];
      }
    }
    if (newUiSchema[currentSection]['ui:order']) {
      newUiSchema[currentSection]['ui:order'] = newUiSchema[currentSection]['ui:order'].filter(
        (key: string) => key !== currentField,
      );
    }
  }
  verna.setSchema(newSchema);
  verna.setUiSchema(newUiSchema);
}

function removeSection(verna: VernaContextProps, id: string) {
  const currentSection = getCurrentSection(id);
  const newSchema = { ...verna.schema };
  const newUiSchema = { ...verna.uiSchema };
  if (newSchema.properties) {
    delete newSchema.properties[currentSection];
  }
  verna.setSchema(newSchema);
  delete newUiSchema[currentSection];
  verna.setUiSchema(newUiSchema);
}

export { addItemToUiSchema, addItemToSchema, addSection, removeSection, removeItem };
