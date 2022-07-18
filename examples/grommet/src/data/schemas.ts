import type { VernaJSONSchemaType } from '@openfun/verna';
import type { UiSchema } from '@rjsf/core';

const schema: VernaJSONSchemaType = {
  description: 'root_description',
  properties: {
    section: {
      description: 'root_section_description',
      properties: {
        select: {
          enum: [
            'root_section_select_enum_0',
            'root_section_select_enum_1',
            'root_section_select_enum_2',
          ],
          type: 'string',
        },
      },
      title: 'root_section_title',
      type: 'object',
    },
    '335df376-9357-42ca-baa4-6159faba0534': {
      properties: {
        '90c8ba81-7624-4be4-93cd-74b05353b5aa': {
          type: 'number',
          maximum: 150,
          minimum: 3,
          title:
            'root_335df376-9357-42ca-baa4-6159faba0534_90c8ba81-7624-4be4-93cd-74b05353b5aa_title',
        },
      },
      title: 'root_335df376-9357-42ca-baa4-6159faba0534_title',
      type: 'object',
    },
  },
  title: 'root_title',
  type: 'object',
};

const uiSchema: UiSchema = {
  '335df376-9357-42ca-baa4-6159faba0534': {
    '90c8ba81-7624-4be4-93cd-74b05353b5aa': {
      'ui:widget': 'numberWidget',
    },
    'ui:order': ['90c8ba81-7624-4be4-93cd-74b05353b5aa'],
  },
  section: {
    select: {
      'ui:widget': 'selectWidget',
    },
    'ui:order': ['select'],
  },
  'ui:order': ['section', '335df376-9357-42ca-baa4-6159faba0534'],
  'ui:submitButtonOptions': {
    norender: false,
    props: {
      className: 'btn btn-info',
      disabled: false,
    },
    submitText: 'Save',
  },
};

export { schema, uiSchema };
