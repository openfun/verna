import type { UiSchema } from '@rjsf/core';
import VernaJSONSchemaType from '../../types/rjsf';
import SelectWidget from './SelectWidget';

const getSchemaDefault = (): VernaJSONSchemaType => ({
  description: 'Desc registration form',
  properties: {
    testSection: {
      properties: {
        field1: {
          title: 'field1',
          type: 'string',
        },
      },
      title: 'Sectiontest',
      type: 'object',
    },
  },
  title: 'A registration form',
  type: 'object',
});

const getCustomSchemaDefault = (): VernaJSONSchemaType => ({
  description: 'Desc registration form',
  properties: {
    testSection: {
      properties: {
        select: {
          title: 'selectfield',
          type: 'string',
        },
      },
      title: 'Sectiontest',
      type: 'object',
    },
  },
  title: 'A registration form',
  type: 'object',
});

const getUiSchemaDefault = (): UiSchema => ({
  testSection: {
    select: {
      'ui:widget': 'SelectWidget',
    },
    'ui:order': ['select'],
  },
});

const getWidgets = () => ({
  SelectWidget: SelectWidget,
});

const getWidgetConf = (): VernaJSONSchemaType => ({
  properties: {
    SelectWidget: {
      properties: {
        enum: {
          additionalItems: {
            type: 'boolean',
          },
          items: {
            type: 'string',
          },
          minItems: 2,
          type: 'array',
        },
        required: {
          type: 'boolean',
        },
      },
      type: 'object',
    },
  },
  type: 'object',
});

export { getSchemaDefault, getUiSchemaDefault, getCustomSchemaDefault, getWidgets, getWidgetConf };
