import type { UiSchema } from '@rjsf/core';

const SEPARATOR_ID_RJSF = '_';

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
  return id.split(SEPARATOR_ID_RJSF)[1];
}

function getCurrentField(id: string): string {
  return id.split(SEPARATOR_ID_RJSF).pop() || id;
}

function getTemplateWidgetName(id: string, uiSchema: UiSchema) {
  const idParts = id.split(SEPARATOR_ID_RJSF);
  const section = uiSchema?.[idParts[1]];
  return idParts.length === 3
    ? section?.[idParts[2]]?.['ui:widget'] || ''
    : section?.['ui:widget'] || '';
}

export { makeid, getCurrentSection, getCurrentField, getTemplateWidgetName, SEPARATOR_ID_RJSF };
