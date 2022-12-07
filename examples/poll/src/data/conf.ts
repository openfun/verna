import { type VernaJSONSchemaType } from '@openfun/verna';
import CheckboxesWidget from '../widgets/CheckboxesWidget';
import CheckboxWidget from '../widgets/CheckboxWidget';
import NumberWidget from '../widgets/NumberWidget';
import SelectWidget from '../widgets/SelectWidget';
import TextareaWidget from '../widgets/TextareaWidget';
import TextWidget from '../widgets/TextWidget';
import CountryMapWidget from ':/widgets/CountryMapWidget';

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
    countryMapWidget: {
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
    textareaWidget: {
      properties: {
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
  CheckboxWidget: CheckboxWidget,
  NumberWidget: NumberWidget,
  TextWidget: TextWidget,
  checkboxWidget: CheckboxWidget,
  checkboxesWidget: CheckboxesWidget,
  countryMapWidget: CountryMapWidget,
  numberWidget: NumberWidget,
  selectWidget: SelectWidget,
  textWidget: TextWidget,
  textareaWidget: TextareaWidget,
};
export { configSchema, widgets };
