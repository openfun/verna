import { useState } from 'react';
import type { UiSchema } from '@rjsf/core';
import VernaProvider, { Section, VernaJSONSchemaType } from '@openfun/verna';
import FormWrapper from './FormWrapper';
import TextWidget from './widgets/TextWidget';
import PasswordWidget from './widgets/PasswordWidget';
import QuizWidget from './widgets/QuizWidget';
import './styles/verna.scss';
import NumberWidget from './widgets/NumberWidget';
import SelectWidget from './widgets/SelectWidget';

function App() {
  const schemaDefault: VernaJSONSchemaType = {
    description: 'Desc registration form',
    properties: {
      section: {
        properties: {
          select: {
            description: 'SELECT DESCRIPTION',
            enum: ['Item 1', 'Item 2', 'Item 3'],
            title: 'Select items',
            type: 'string',
          },
        },
        type: 'object',
      },
    },
    title: 'A registration form',
    type: 'object',
  };

  // const translations = {
  //   'EN-gb': {
  //     root_section_select_title: 'title in english',
  //   },
  //   'FR-fr': {
  //     root_section_select_title: 'titre en francais',
  //   },
  // };

  const formData = {};

  const widgets = {
    numberWidget: NumberWidget,
    passwordWidget: PasswordWidget,
    quizWidget: QuizWidget,
    selectWidget: SelectWidget,
    textWidget: TextWidget,
  };

  // TODO: Add management for ui:ObjectFieldTemplate saving
  const uiSchema: UiSchema = {
    section: {
      select: {
        'ui:widget': 'selectWidget',
      },
      // Need to found a clean fix so the ObjectFieldTemplate may be a string
      'ui:ObjectFieldTemplate': Section,
      'ui:order': ['select'],
    },
    'ui:submitButtonOptions': {
      // working in the next release
      norender: false,
      props: {
        className: 'btn btn-info',
        disabled: true,
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

  const language = navigator.language.split(/[-_]/)[0];

  // const translations = {
  //   en: {
  //     enum: 'Options',
  //     maxLength: 'maximum length',
  //     maximum: 'maximum',
  //     minLength: 'minimum length',
  //     minimum: 'minimum',
  //     required: 'required',
  //     saveParameters: 'save',
  //     widgetParameters: 'parameters',
  //   },
  //   fr: {
  //     enum: 'Options',
  //     maxLength: 'Longueur maximum',
  //     maximum: 'maximum',
  //     minLength: 'Longueur minimum',
  //     minimum: 'minimum',
  //     required: 'requis',
  //     saveParameters: 'Valider',
  //     widgetParameters: 'Paramètres',
  //   },
  // };
  const translations = {
    en: {
      enum: 'Options',
      maxLength: 'maximum length',
      maximum: 'maximum',
      minLength: 'minimum length',
      minimum: 'minimum',
      required: 'required',
      saveParameters: 'save',
      widgetParameters: 'parameters',
    },
    fr: {
      enum: 'Options',
      maxLength: 'Longueur maximum',
      maximum: 'maximum',
      minLength: 'Longueur minimum',
      minimum: 'minimum',
      required: 'requis',
      saveParameters: 'Valider',
      widgetParameters: 'Paramètres',
    },
  };

  return (
    <div style={{ backgroundColor: 'lightgray' }}>
      <VernaProvider
        configSchema={configSchema}
        defaultFormValues={formData}
        defaultSchema={schemaDefault}
        defaultUiSchema={uiSchema}
        defaultWidgets={widgets}
        isEditor={isEditor}
        language={language}
        translations={translations}
      >
        <FormWrapper toggleEditorMode={toggleEditorMode} />
      </VernaProvider>
    </div>
  );
}

export default App;
