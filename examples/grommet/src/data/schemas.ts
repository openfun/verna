import type { VernaJSONSchemaType } from '@openfun/verna';
import type { UiSchema } from '@rjsf/core';

const schema: VernaJSONSchemaType = {
  description: 'root__description',
  properties: {
    section: {
      description: 'root_section__description',
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
      title: 'root_section__title',
      type: 'object',
    },
  },
  title: 'root__title',
  type: 'object',
};

const uiSchema: UiSchema = {
  section: {
    select: {
      'ui:widget': 'selectWidget',
    },
    'ui:order': ['select'],
  },
  'ui:order': ['section'],
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
