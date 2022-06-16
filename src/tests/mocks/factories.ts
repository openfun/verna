import type { UiSchema } from '@rjsf/core';
import VernaJSONSchemaType from '../../types/rjsf';
import SelectWidget from './SelectWidget';
import { TranslationType } from '../../types/translations';

const schemaFactory = (): VernaJSONSchemaType => ({
  description: 'root_description',
  properties: {
    testSection: {
      properties: {
        field1: {
          title: 'root_testSection_field1',
          type: 'string',
        },
      },
      title: 'root_testSection_title',
      type: 'object',
    },
  },
  title: 'root_title',
  type: 'object',
});

const selectSchemaFactory = (): VernaJSONSchemaType => ({
  description: 'root_description',
  properties: {
    testSection: {
      properties: {
        select: {
          enum: ['root_testSection_select_enum_0', 'root_testSection_select_enum_1'],
          title: 'root_testSection_select_title',
          type: 'string',
        },
      },
      title: 'root_testSection_title',
      type: 'object',
    },
  },
  title: 'root_title',
  type: 'object',
});

const uiSchemaFactory = (): UiSchema => ({
  testSection: {
    select: {
      'ui:widget': 'selectWidget',
    },
    'ui:order': ['select'],
  },
});

const checkBoxesSchemaFactory = (): VernaJSONSchemaType => ({
  description: 'root_description',
  properties: {
    testSection: {
      properties: {
        checkboxes: {
          description: 'root_testSection_checkboxes_description',
          items: {
            enum: ['root_testSection_checkboxes_items_0', 'root_testSection_checkboxes_items_1'],
            type: 'object',
          },
          title: 'root_testSection_checkboxes_title',
          type: 'array',
          uniqueItems: true,
        },
      },
      title: 'root_testSection_title',
      type: 'object',
    },
  },
  title: 'root_title',
  type: 'object',
});

const checkBoxesUiSchemaFactory = (): UiSchema => ({
  testSection: {
    checkboxes: {
      'ui:widget': 'CheckboxesWidget',
    },
    'ui:order': ['checkboxes'],
  },
});

const widgetsFactory = () => ({
  selectWidget: SelectWidget,
});

const confSchemaFactory = (): VernaJSONSchemaType => ({
  properties: {
    CheckboxesWidget: {
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
      type: 'object',
    },
  },
  type: 'object',
});

const translationsFactory = (translations?: TranslationType) => {
  const { en, fr, ...other } = translations || {};

  return {
    en: {
      root_description: 'Desc registration form',
      root_testSection_checkboxes_description: 'checkboxes description',
      root_testSection_checkboxes_items_0: 'item 0 en',
      root_testSection_checkboxes_items_1: 'item 1 en',
      root_testSection_checkboxes_title: 'checkboxes title',
      root_testSection_field1: 'field1 title',
      root_testSection_select_enum_0: 'enum 0 en',
      root_testSection_select_enum_1: 'enum 1 en',
      root_testSection_select_title: 'selectfield',
      root_testSection_title: 'Sectiontest',
      root_title: 'A registration form',
      ...en,
    },
    fr: {
      root_description: 'Description',
      root_testSection_checkboxes_description: 'Description des checkboxes',
      root_testSection_checkboxes_items_0: 'item 0 fr',
      root_testSection_checkboxes_items_1: 'item 1 fr',
      root_testSection_checkboxes_title: 'Titre des checkboxes',
      root_testSection_field1: 'titre du field1',
      root_testSection_select_enum_0: 'enum 0 fr',
      root_testSection_select_enum_1: 'enum 1 fr',
      root_testSection_select_title: 'titre du select',
      root_testSection_title: 'titre de la section',
      root_title: 'formulaire',
      ...fr,
    },
    ...other,
  };
};

const translationUiFactory = () => ({
  'components.EditorFieldTemplate.parameters': 'Paramètres',
  'components.WidgetPropertiesForm.enum': 'Options',
  'components.WidgetPropertiesForm.items': 'Options avancées',
  'components.WidgetPropertiesForm.maxLength': 'Longueur maximum',
  'components.WidgetPropertiesForm.maximum': 'Maximum',
  'components.WidgetPropertiesForm.minLength': 'Longueur minimum',
  'components.WidgetPropertiesForm.minimum': 'Minimum',
  'components.WidgetPropertiesForm.required': 'Requis',
  'components.WidgetPropertiesForm.submitWidgetParameter': 'Sauvegarder',
});

export {
  checkBoxesSchemaFactory,
  checkBoxesUiSchemaFactory,
  schemaFactory,
  uiSchemaFactory,
  selectSchemaFactory,
  widgetsFactory,
  confSchemaFactory,
  translationsFactory,
  translationUiFactory,
};
