import type { FieldTemplateProps } from '@rjsf/core';
import { useVerna } from '../VernaContextProvider';
import { getCurrentField, getCurrentSection, makeid } from '../utils';
import { stringDefinition, sectionDefinition } from '../schemaComponents/templates';
import { JSONSchema7 } from 'json-schema';

// This component is used to render every field
// Its purpose here is to add functionality common to every of those such as add or remove
// It will be used to add drag and drop area later

export default function RenderFieldTemplate({ id, schema, children }: FieldTemplateProps) {
  const { schema: vernaSchema, setSchema, uiSchema, setUiSchema, selector } = useVerna();
  const isRoot = id === 'root';
  const isSection = schema.type === 'object';
  const ownProperties = Object.keys(schema.properties || {}).length > 0;
  const canAddField = schema.type !== 'object';
  const canAddSection = isSection && !isRoot && !selector;
  const currentSection = getCurrentSection(id);
  const currentField = getCurrentField(id);

  function addItemToSchema(newKey: string) {
    const newSchema = { ...vernaSchema };
    if (newSchema.properties) {
      if (selector) {
        if (newSchema.properties) {
          newSchema.properties[newKey] = stringDefinition(newKey);
        }
      } else {
        const section = newSchema.properties[currentSection] as JSONSchema7;
        if (section.properties) {
          section.properties[newKey] = stringDefinition(newKey);
        }
      }
    }
    setSchema(newSchema);
  }

  function addItemToUiSchemaOrder(newKey: string) {
    const newUiSchema = { ...uiSchema };
    if (selector) {
      if (newUiSchema['ui:order']) {
        const currentOrderIndex = newUiSchema['ui:order'].findIndex(
          (key: string) => key === currentField,
        );
        newUiSchema['ui:order'].splice(currentOrderIndex + 1, 0, newKey);
      } else {
        newUiSchema['ui:order'] = [newKey];
      }
    } else {
      if (newUiSchema?.[currentSection]?.['ui:order']) {
        const currentSectionIndex = uiSchema[currentSection]['ui:order'].findIndex(
          (key: string) => key === currentField,
        );
        newUiSchema[currentSection]['ui:order'].splice(currentSectionIndex + 1, 0, newKey);
      } else {
        newUiSchema[currentSection] = {};
        newUiSchema[currentSection]['ui:order'] = [newKey];
      }
    }
    setUiSchema(newUiSchema);
  }

  function addItem() {
    const newKey = makeid(10);
    addItemToSchema(newKey);
    addItemToUiSchemaOrder(newKey);
  }

  function addSection() {
    const newSchema = { ...vernaSchema };
    const newKey = makeid(10);
    if (newSchema.properties) {
      newSchema.properties[newKey] = sectionDefinition(newKey);
    }
    setSchema(newSchema);
    const currentSection = getCurrentSection(id);
    const newUiSchema = { ...uiSchema };
    if (newUiSchema['ui:order']) {
      const currentSectionIndex =
        newUiSchema['ui:order'].findIndex((key) => key === currentSection) || 0;
      newUiSchema['ui:order'].splice(currentSectionIndex + 1, 0, newKey);
      setUiSchema(newUiSchema);
    }
  }

  function removeItem() {
    const newSchema = { ...vernaSchema };
    const newUiSchema = { ...uiSchema };
    if (selector) {
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
    setSchema(newSchema);
    setUiSchema(newUiSchema);
  }

  function removeSection() {
    const newSchema = { ...vernaSchema };
    const newUiSchema = { ...uiSchema };
    if (newSchema.properties) {
      delete newSchema.properties[currentSection];
    }
    setSchema(newSchema);
    delete newUiSchema[currentSection];
    setUiSchema(newUiSchema);
  }

  return (
    <div>
      {id}
      {children}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {(canAddField ||
          (!ownProperties && isSection && !isRoot) ||
          (selector && !ownProperties)) && (
          <button onClick={addItem} style={{ width: '100%' }}>
            Add an input
          </button>
        )}
        {(canAddSection || (isRoot && !ownProperties && !selector)) && (
          <button onClick={addSection} style={{ width: '100%' }}>
            Add a section
          </button>
        )}
        {canAddField && (
          <button onClick={removeItem} style={{ width: '20px' }}>
            x
          </button>
        )}
        {canAddSection && (
          <button onClick={removeSection} style={{ width: '20px' }}>
            x
          </button>
        )}
      </div>
    </div>
  );
}
