import type { UiSchema } from '@rjsf/core';
import { RJSF_ID_SEPARATOR } from './settings';

function makeid(length: number) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Ids of elements in JSON Schema, are split by "_" for every levels starting with root, such as root_section_field
function getCurrentSection(id: string): string {
  return id.split(RJSF_ID_SEPARATOR)[1];
}

function getCurrentField(id: string): string {
  return id.split(RJSF_ID_SEPARATOR).pop() || id;
}

function getTemplateWidgetName(id: string, uiSchema: UiSchema) {
  const [, firstId, secondId] = id.split(RJSF_ID_SEPARATOR);
  const section = uiSchema?.[firstId];
  // The widget id is built on its ancestors ids and the current field id joined by `RJSF_ID_SEPARATOR`. So by
  // splitting this id, we are able to know the widget's depth within the schema. As we allow to add inputs only
  // within section and sections can only be added under the root node, if the id is composed of three parts we
  // are able to know that widget is an input and if the length is two the element is a section.
  // if there are only two elements then secondId is undefined, it means there is a selector in the context then
  // firstId is targeting an input
  return secondId ? section?.[secondId]?.['ui:widget'] || '' : section?.['ui:widget'] || '';
}

export { makeid, getCurrentSection, getCurrentField, getTemplateWidgetName };
