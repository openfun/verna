import { VernaContextProps } from '../../providers/VernaProvider';
import { getWidgetName, getSectionName } from '../utils';

function removeWidget(verna: VernaContextProps, id: string) {
  const currentSection = getSectionName(id);
  const currentField = getWidgetName(id);
  const newSchema = { ...verna.schema };
  const newUiSchema = { ...verna.uiSchema };

  if (!currentField || !currentSection) return;

  if (verna.selector) {
    if (newSchema.properties) delete newSchema.properties[currentField];
    if (newUiSchema['ui:order']) {
      newUiSchema['ui:order'] = newUiSchema['ui:order'].filter(
        (key: string) => key !== currentField,
      );
    }
  } else {
    const sectionProperties = newSchema.properties?.[currentSection] || {};
    delete sectionProperties.properties?.[currentField];
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
  const currentSection = getSectionName(id);
  const newSchema = { ...verna.schema };
  const newUiSchema = { ...verna.uiSchema };
  if (!currentSection) return;
  delete newSchema.properties?.[currentSection];
  verna.setSchema(newSchema);
  delete newUiSchema[currentSection];
  verna.setUiSchema(newUiSchema);
}

export { removeSection, removeWidget };
