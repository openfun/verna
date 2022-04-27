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
  const idParts = id.split(RJSF_ID_SEPARATOR);
  const section = uiSchema?.[idParts[1]];

  // If the id is made of 3 parts, it's that there is a section before the widget used
  // Then you need to get it in the UiSchema before accessing the ui:widget
  return idParts.length === 3
    ? section?.[idParts[2]]?.['ui:widget'] || ''
    : section?.['ui:widget'] || '';
}

export { makeid, getCurrentSection, getCurrentField, getTemplateWidgetName };
