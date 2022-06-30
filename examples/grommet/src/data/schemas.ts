import { VernaJSONSchemaType } from '@openfun/verna';
import type { UiSchema } from '@rjsf/core';

const schema: VernaJSONSchemaType = {
  description: 'root_description',
  properties: {
    section: {
      properties: {
        checkboxes: {
          description: 'root_section_checkboxes_description',
          items: {
            enum: [
              'root_section_checkboxes_items_0',
              'root_section_checkboxes_items_1',
              'root_section_checkboxes_items_2',
            ],
            type: 'object',
          },
          title: 'root_section_checkboxes_title',
          type: 'array',
          uniqueItems: true,
        },
        select: {
          description: 'root_section_select_description',
          enum: [
            'root_section_select_enum_0',
            'root_section_select_enum_1',
            'root_section_select_enum_2',
          ],
          title: 'root_section_select_title',
          type: 'string',
        },
      },
      type: 'object',
    },
  },
  title: 'root_title',
  type: 'object',
};

const uiSchema: UiSchema = {
  section: {
    checkboxes: {
      'ui:widget': 'checkboxesWidget',
    },
    select: {
      'ui:widget': 'selectWidget',
    },
    'ui:order': ['select'],
  },
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
