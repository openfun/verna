import { VernaJSONSchemaType } from '@openfun/verna';
import CheckboxWidget from '../widgets/CheckboxWidget';
import CheckboxesWidget from '../widgets/CheckboxesWidget';
import NumberWidget from '../widgets/NumberWidget';
import PasswordWidget from '../widgets/PasswordWidget';
import SelectWidget from '../widgets/SelectWidget';
import TextWidget from '../widgets/TextWidget';
import TextareaWidget from '../widgets/TextareaWidget';

const configSchema: VernaJSONSchemaType = {
  properties: {
    CheckboxWidget: {
      properties: {
        items: {
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
    },
    checkboxesWidget: {
      properties: {
        items: {
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
    },
    textareaWidget: {
      properties: {
        required: {
          type: 'boolean',
        },
      },
      type: 'object',
    },
    numberWidget: {
      properties: {
        maximum: {
          type: 'number',
        },
        minimum: {
          type: 'number',
        },
        required: {
          type: 'boolean',
        },
      },
      type: 'object',
    },
    selectWidget: {
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
    },
    textWidget: {
      properties: {
        maxLength: {
          type: 'number',
        },
        required: {
          type: 'boolean',
        },
      },
      type: 'object',
    },
  },
  type: 'object',
};

const widgets = {
  checkboxWidget: CheckboxWidget,
  checkboxesWidget: CheckboxesWidget,
  numberWidget: NumberWidget,
  passwordWidget: PasswordWidget,
  selectWidget: SelectWidget,
  textWidget: TextWidget,
  textareaWidget: TextareaWidget,
};

export { configSchema, widgets };
