import { ObjectFieldTemplateProps } from '@rjsf/core';
import _ from 'lodash';
import React from 'react';
import { defineMessages, type IntlShape } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { sectionDefinition } from ':/templates';
import { VernaSchemaType } from ':/types/rjsf';
import { Maybe, Nullable } from ':/types/utils';
import { getSectionName } from ':/utils';
import { addTranslations } from ':/utils/schema';

const messages = defineMessages({
  defaultSectionTitle: {
    defaultMessage: 'Default section title',
    description: 'The default name of a newly created section',
    id: 'templates.defaultSectionTitle',
  },
});

export function addSection(
  schema: VernaSchemaType,
  id: Nullable<string>,
  SectionTemplate: Maybe<React.FunctionComponent<ObjectFieldTemplateProps>>,
  intl?: IntlShape,
) {
  const newSchema = _.cloneDeep(schema);
  const newKey = uuidv4();

  if (!newSchema.formSchema) newSchema.formSchema = {};
  if (!newSchema.formSchema?.properties) newSchema.formSchema.properties = {};

  newSchema.formSchema.properties[newKey] = sectionDefinition();

  let newIdTitle = '';
  if (intl) {
    // Set default title for the new section
    newIdTitle = ['root', newKey, 'title'].join(RJSF_ID_SEPARATOR);
    newSchema.translationSchema = addTranslations(schema, {
      [intl.locale]: { [newIdTitle]: intl.formatMessage(messages.defaultSectionTitle) },
    }).translationSchema;
  } else {
    newIdTitle = messages.defaultSectionTitle.defaultMessage;
  }
  newSchema.formSchema.properties[newKey].title = newIdTitle;

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
