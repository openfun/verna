import type { UiSchema } from '@rjsf/core';
import { merge } from 'lodash';
import NumberWidget from './NumberWidget';
import SelectWidget from './SelectWidget';
import { WidgetsType } from ':/providers/VernaProvider';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';
import { TranslationType } from ':/types/translations';

const vernaSchemaFactory = (schema?: VernaSchemaType): VernaSchemaType => ({
  formSchema: schemaFactory(schema?.formSchema),
  translationSchema: translationsFactory(schema?.translationSchema),
  uiSchema: uiSchemaFactory(schema?.uiSchema),
});

/**
 * This schema contains a select widget, it's needed for tests with options
 * to modify on a widget using an enum
 */
const vernaEnumSchemaFactory = (empty?: boolean): VernaSchemaType => ({
  formSchema: selectSchemaFactory(empty),
  translationSchema: translationsFactory(),
  uiSchema: selectUiSchemaFactory(),
});

/**
 * This schema contains a select widget, it's needed for tests with options
 * to modify on a widget using items
 */
const vernaItemsSchemaFactory = (empty?: boolean): VernaSchemaType => ({
  formSchema: checkBoxesSchemaFactory(empty),
  translationSchema: translationsFactory(),
  uiSchema: checkBoxesUiSchemaFactory(),
});

const schemaFactory = (schema?: VernaJSONSchemaType): VernaJSONSchemaType =>
  merge(
    {
      description: 'root_description',
      properties: {
        testSection: {
          properties: {
            field1: {
              maximum: 10,
              minimum: 5,
              title: 'root_testSection_field1_title',
              type: 'number',
            },
          },
          title: 'root_testSection_title',
          type: 'object',
        },
      },
      title: 'root_title',
      type: 'object',
    },
    schema,
  );

const uiSchemaFactory = (uiSchema?: UiSchema): UiSchema =>
  merge(
    {
      testSection: {
        field1: {
          'ui:widget': 'numberWidget',
        },
        'ui:order': ['field1'],
      },
      'ui:order': ['testSection'],
    },
    uiSchema,
  );

const selectSchemaFactory = (emptySelect?: boolean): VernaJSONSchemaType => ({
  description: 'root_description',
  properties: {
    testSection: {
      description: 'root_testSection_description',
      properties: {
        select: {
          enum: emptySelect
            ? []
            : ['root_testSection_select_enum_0', 'root_testSection_select_enum_1'],
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

const selectUiSchemaFactory = (): UiSchema => ({
  testSection: {
    select: {
      'ui:widget': 'selectWidget',
    },
    'ui:order': ['select'],
  },
});

const checkBoxesSchemaFactory = (empty?: boolean): VernaJSONSchemaType => ({
  description: 'root_description',
  properties: {
    testSection: {
      properties: {
        checkboxes: {
          description: 'root_testSection_checkboxes_description',
          items: {
            enum: empty
              ? []
              : ['root_testSection_checkboxes_items_0', 'root_testSection_checkboxes_items_1'],
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

const widgetsFactory = (widgets?: WidgetsType) => ({
  ...widgets,
  numberWidget: NumberWidget,
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

const translationsFactory = (translations: TranslationType = {}) => {
  return merge(
    {
      'en-US': {
        root_description: 'Registration form description',
        root_testSection_checkboxes_items_0: 'Checkbox 0',
        root_testSection_checkboxes_items_1: 'Checkbox 1',
        root_testSection_checkboxes_title: 'Checkboxes widget',
        root_testSection_description: 'Description of the first section',
        root_testSection_field1_title: 'First field',
        root_testSection_select_enum_0: 'Option 0',
        root_testSection_select_enum_1: 'Option 1',
        root_testSection_select_title: 'A select widget',
        root_testSection_title: 'First section',
        root_title: 'A registration form',
      },
      'fr-FR': {
        root_description: "Description du formulaire d'inscription",
        root_testSection_checkboxes_items_0: 'Case à cocher 0',
        root_testSection_checkboxes_items_1: 'Case à cocher 1',
        root_testSection_checkboxes_title: 'Un widget cases à cocher',
        root_testSection_description: 'Description de la première section',
        root_testSection_field1_title: 'Premier champ',
        root_testSection_select_enum_0: 'Choix 0',
        root_testSection_select_enum_1: 'Choix 1',
        root_testSection_select_title: 'Un widget menu déroulant',
        root_testSection_title: 'Première section',
        root_title: "Un formulaire d'inscription",
      },
    },
    translations,
  );
};

const translationUiFactory = () => ({
  'components.EditorFieldTemplate.parameters': 'Paramètres',
  'components.WidgetPropertiesForm.description': 'Description',
  'components.WidgetPropertiesForm.enum': 'Options',
  'components.WidgetPropertiesForm.items': 'Options avancées',
  'components.WidgetPropertiesForm.maxLength': 'Longueur maximum',
  'components.WidgetPropertiesForm.maximum': 'Maximum',
  'components.WidgetPropertiesForm.minLength': 'Longueur minimum',
  'components.WidgetPropertiesForm.minimum': 'Minimum',
  'components.WidgetPropertiesForm.required': 'Requis',
  'components.WidgetPropertiesForm.submitWidgetParameter': 'Sauvegarder',
  'components.WidgetPropertiesForm.title': 'Nom du champ',
  'components.fields.section.parameters': 'Paramètres',
});

export {
  checkBoxesSchemaFactory,
  checkBoxesUiSchemaFactory,
  confSchemaFactory,
  schemaFactory,
  selectUiSchemaFactory,
  selectSchemaFactory,
  widgetsFactory,
  uiSchemaFactory,
  translationsFactory,
  translationUiFactory,
  vernaEnumSchemaFactory,
  vernaItemsSchemaFactory,
  vernaSchemaFactory,
};
