import { useState } from 'react';
import type { JSONSchema7 } from 'json-schema';
import type { UiSchema } from '@rjsf/core';
import { VernaContextProvider } from '@openfun/verna';
import FormWrapper from './FormWrapper';
import TextWidget from './widgets/TextWidget';
import PasswordWidget from './widgets/PasswordWidget';
import QuizWidget from './widgets/QuizWidget';
import './styles/verna.scss';
import NumberWidget from './widgets/NumberWidget';
import SelectWidget from './widgets/SelectWidget';

function App() {
  const schemaDefault: JSONSchema7 = {
    description: 'Desc registration form',
    properties: {
      section: {
        properties: {
          select: {
            description: 'description',
            enum: ['aaaaaaa'],
            title: 'TEST select',
            type: 'string',
          },
        },
        type: 'object',
      },
    },
    title: 'A registration form',
    type: 'object',
  };

  const formData = {};

  const widgets = {
    SelectWidget: SelectWidget,
    numberWidget: NumberWidget,
    passwordWidget: PasswordWidget,
    quizWidget: QuizWidget,
    textWidget: TextWidget,
  };

  // TODO: Add management for ui:ObjectFieldTemplate saving
  const uiSchema: UiSchema = {
    'ui:options': {
      'ui:submitButtonOptions': {
        submitText: 'Confirm Details',
        norender: false,
        props: {
          disabled: false,
          className: 'btn btn-info',
        },
      },
    },
    // section: {
    //   select: {
    //     'ui:widget': 'SelectWidget',
    //   },
    //   'ui:order': ['select'],
    // },
    // 'ui:submitButtonOptions': {
    //   norender: true,
    //   props: {
    //     className: 'btn btn-info',
    //     disabled: true,
    //   },
    //   submitText: 'Save',
    // },
  };

  const configSchema: JSONSchema7 = {
    properties: {
      NumberFieldWidget: {
        properties: {
          required: {
            type: 'boolean',
          },
        },
        type: 'object',
      },
      SelectWidget: {
        properties: {
          items: {
            additionalItems: {
              type: 'boolean',
            },
            items: {
              type: 'string',
            },
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

  return (
    <div style={{ backgroundColor: 'lightgray' }}>
      <VernaContextProvider
        configSchema={configSchema}
        defaultFormValues={formData}
        defaultSchema={schemaDefault}
        defaultUiSchema={uiSchema}
        defaultWidgets={widgets}
        isEditor={isEditor}
      >
        <FormWrapper toggleEditorMode={toggleEditorMode} />
      </VernaContextProvider>
    </div>
  );
}

export default App;
