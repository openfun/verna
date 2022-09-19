import { ObjectFieldTemplateProps } from '@rjsf/core';
import _ from 'lodash';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sectionDefinition } from ':/templates';
import { VernaSchemaType } from ':/types/rjsf';
import { Maybe, Nullable } from ':/types/utils';
import { getSectionName } from ':/utils';

export function addSection(
  schema: VernaSchemaType,
  id: Nullable<string>,
  SectionTemplate: Maybe<React.FunctionComponent<ObjectFieldTemplateProps>>,
) {
  const newSchema = _.cloneDeep(schema);
  const newKey = uuidv4();

  if (!newSchema.formSchema) newSchema.formSchema = {};
  if (!newSchema.formSchema?.properties) newSchema.formSchema.properties = {};

  newSchema.formSchema.properties[newKey] = sectionDefinition();

  const parentSection = getSectionName(id, true);

  if (!newSchema.uiSchema) newSchema.uiSchema = { 'ui:order': [] };
  if (newSchema.uiSchema?.['ui:order']?.length === 0) {
    newSchema.uiSchema['ui:order'] = [newKey];
  } else {
    const currentSectionIndex = parentSection
      ? newSchema.uiSchema['ui:order']!.findIndex((key) => key === parentSection) || 0
      : -1;
    newSchema.uiSchema['ui:order']!.splice(currentSectionIndex + 1, 0, newKey);
  }
  newSchema.uiSchema[newKey] = {
    'ui:ObjectFieldTemplate': SectionTemplate,
  };
  return newSchema;
}
