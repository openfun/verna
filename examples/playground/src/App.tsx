import { useState } from 'react';
import type { UiSchema } from '@rjsf/core';
import { VernaProvider, VernaJSONSchemaType } from '@openfun/verna';
import FormWrapper from './FormWrapper';
import TextWidget from './widgets/TextWidget';
import PasswordWidget from './widgets/PasswordWidget';
import QuizWidget from './widgets/QuizWidget';
import './styles/verna.scss';
import NumberWidget from './widgets/NumberWidget';
import SelectWidget from './widgets/SelectWidget';
import TextareaWidget from './widgets/TextareaWidget';
import CheckboxWidget from './widgets/CheckboxWidget';
import transformErrors from './ErrorCustom';

function App() {
  const [locale, setLocale] = useState('en');
  const schemaDefault: VernaJSONSchemaType = {
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

  const formData = {};

  const widgets = {
    checkboxWidget: CheckboxWidget,
    numberWidget: NumberWidget,
    passwordWidget: PasswordWidget,
    quizWidget: QuizWidget,
    selectWidget: SelectWidget,
    textWidget: TextWidget,
    textareaWidget: TextareaWidget,
  };

  // TODO: Add management for ui:ObjectFieldTemplate saving
  const uiSchema: UiSchema = {
    section: {
      checkboxes: {
        'ui:widget': 'CheckboxesWidget',
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
      TextareaWidget: {
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

  const [isEditor, setIsEditor] = useState(true);

  const toggleEditorMode = () => setIsEditor(!isEditor);

  const translations = {
    en: {
      root_description: 'Desc registration form',
      root_section_checkboxes_description: 'Checkboxes description',
      root_section_checkboxes_items_0: 'item 0 en',
      root_section_checkboxes_items_1: 'item 1 en',
      root_section_checkboxes_items_2: 'item 2 en',
      root_section_checkboxes_title: 'Checkboxes title',
      root_section_select_description: 'Description select',
      root_section_select_enum_0: 'enum 0 en',
      root_section_select_enum_1: 'enum 1 en',
      root_section_select_enum_2: 'enum 2 en',
      root_section_select_title: 'Select title',
      root_title: 'A registration form',
    },
    fr: {
      root_description: "Description formulaire d'inscription",
      root_section_checkboxes_description: 'Description checkboxes',
      root_section_checkboxes_items_0: 'item 0 fr',
      root_section_checkboxes_items_1: 'item 1 fr',
      root_section_checkboxes_items_2: 'item 2 fr',
      root_section_checkboxes_title: 'Titre checkboxes',
      root_section_select_description: 'Description select',
      root_section_select_enum_0: 'enum 0 fr',
      root_section_select_enum_1: 'enum 1 fr',
      root_section_select_enum_2: 'enum 2 fr',
      root_section_select_title: 'Titre select',
      root_title: 'Formulaire',
    },
  };

  const translationUi = {
    'components.EditorFieldTemplate.parameters': 'Paramètres',
    'components.WidgetPropertiesForm.enum': 'Options',
    'components.WidgetPropertiesForm.items': 'Options avancées',
    'components.WidgetPropertiesForm.maxLength': 'Longueur maximum',
    'components.WidgetPropertiesForm.maximum': 'Maximum',
    'components.WidgetPropertiesForm.minLength': 'Longueur minimum',
    'components.WidgetPropertiesForm.minimum': 'Minimum',
    'components.WidgetPropertiesForm.required': 'Requis',
    'components.WidgetPropertiesForm.submitWidgetParameter': 'Sauvegarder',
  };

  return (
    <div style={{ backgroundColor: 'lightgray' }}>
      <VernaProvider
        configSchema={configSchema}
        defaultFormValues={formData}
        defaultLocale={locale}
        defaultSchema={schemaDefault}
        defaultUiSchema={uiSchema}
        defaultWidgets={widgets}
        isEditor={isEditor}
        locale={locale}
        transformErrors={transformErrors}
        translationUi={locale === 'fr' ? translationUi : undefined}
        translations={translations}
      >
        <FormWrapper setLocale={setLocale} toggleEditorMode={toggleEditorMode} />
      </VernaProvider>
    </div>
  );
}

export default App;
