import { VernaProvider, type VernaJSONSchemaType } from '@openfun/verna';
import type { UiSchema } from '@rjsf/core';
import { Suspense, useState } from 'react';
import { FormattedMessage, useIntl, defineMessages } from 'react-intl';
import transformErrors from './ErrorCustom';
import FormWrapper from './FormWrapper';
import CheckboxWidget from './widgets/CheckboxWidget';
import NumberWidget from './widgets/NumberWidget';
import PasswordWidget from './widgets/PasswordWidget';
import SelectWidget from './widgets/SelectWidget';
import TextareaWidget from './widgets/TextareaWidget';
import TextWidget from './widgets/TextWidget';
import ':/styles/verna.scss';

const messages = defineMessages({
  loading: {
    defaultMessage: 'Loading...',
    description: 'Message displayed while verna is loading',
    id: 'components.App.loading',
  },
  save: {
    defaultMessage: 'Save',
    description: 'Label of the custom save button',
    id: 'components.App.save',
  },
  title: {
    defaultMessage: '🧑‍💻 Verna Playground',
    description: 'Title of the playground application',
    id: 'components.App.title',
  },
});

const translations = {
  'en-US': {
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
  'fr-FR': {
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

function App() {
  const intl = useIntl();

  const formSchema: VernaJSONSchemaType = {
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
        'ui:widget': 'CheckboxesWidget',
      },
      select: {
        'ui:widget': 'selectWidget',
      },
      'ui:order': ['checkboxes', 'select'],
    },
    'ui:order': ['section'],
    'ui:submitButtonOptions': {
      norender: false,
      props: {
        className: 'btn btn-info',
        disabled: false,
      },
      submitText: intl.formatMessage(messages.save),
    },
  };

  const configSchema: VernaJSONSchemaType = {
    properties: {
      CheckboxWidget: {
        properties: {
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

  const formData = {};

  const widgets = {
    NumberWidget: NumberWidget,
    TextWidget: TextWidget,
    checkboxWidget: CheckboxWidget,
    numberWidget: NumberWidget,
    passwordWidget: PasswordWidget,
    selectWidget: SelectWidget,
    textWidget: TextWidget,
    textareaWidget: TextareaWidget,
  };

  const [isEditor, setIsEditor] = useState(true);

  const toggleEditorMode = () => setIsEditor(!isEditor);

  return (
    <div style={{ backgroundColor: 'lightgray' }}>
      <h1>
        <FormattedMessage {...messages.title} />
      </h1>
      <Suspense fallback={<FormattedMessage {...messages.loading} />}>
        <VernaProvider
          configSchema={configSchema}
          defaultFormValues={formData}
          defaultWidgets={widgets}
          intl={intl}
          isEditor={isEditor}
          transformErrors={transformErrors}
          defaultSchema={{
            formSchema,
            translationSchema: translations,
            uiSchema,
          }}
        >
          <FormWrapper toggleEditorMode={toggleEditorMode} />
        </VernaProvider>
      </Suspense>
    </div>
  );
}

export default App;
