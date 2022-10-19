import type { UiSchema } from '@rjsf/core';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { Maybe } from ':/types/utils';

/**
 * Retrieve the section name from the provided id.
 *
 * In JSON Schema, an element id is composed through its ancestor names and its name
 * joined by `RJSF_ID_SEPARATOR`. The root element name is always "root".
 * e.g: root_section_field.
 *
 * As a section is always the first element under the root element, to retrieve its name
 * we have to split the id then get the second value.
 *
 * If the id is only in two parts, it means either it's a section id, or that it has no section
 * and it's a widget id
 */
function getSectionName(id: string | null, isSectionId?: boolean): Maybe<string> {
  const idParts = id?.split(RJSF_ID_SEPARATOR);
  const isValidSectionId = (isSectionId && id !== 'root') || (id && id.length > 0);

  if (idParts?.length === 3) {
    // If the id is shaped like root_section_id
    return idParts[1];
  }
  if (isValidSectionId) {
    // if the id is a section id and the id is a valid id
    return idParts?.pop();
  }
  // if none of the upper conditions are valid, it means there is no
  // intermediate section in this id
  return undefined;
}

/**
 * Retrieve the widget name from the provided id.
 *
 * In JSON Schema, an element id is composed through its ancestor names and its name
 * joined by `RJSF_ID_SEPARATOR`. The root element name is always "root".
 * e.g: root_section_field.
 *
 * As a widget is always the last element, to retrieve its name we have to split the id
 * then get the last value.
 */
function getWidgetName(id: string): Maybe<string> {
  return id.split(RJSF_ID_SEPARATOR).pop();
}

/**
 * Retrieve the widget name from the provided id.
 *
 * In JSON Schema, an element id is composed through its ancestor names and its name
 * joined by `RJSF_ID_SEPARATOR`. The root element name is always "root".
 * e.g: root_section_field.
 *
 * The UiWidgetName is the name of the component rendered
 * It uses the id to get the section name and the widget name
 * With those, it can access to the ui:widget value indication the name of the component rendered
 */
function getUiWidgetName(id: string, uiSchema: UiSchema) {
  const [, firstId, secondId] = id.split(RJSF_ID_SEPARATOR);
  const section = uiSchema?.[firstId];
  return secondId ? section?.[secondId]?.['ui:widget'] || '' : section?.['ui:widget'] || '';
}

export { getSectionName, getWidgetName, getUiWidgetName };
