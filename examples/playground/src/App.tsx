import type { JSONSchema7 } from 'json-schema';
import type { UiSchema } from '@rjsf/core';
import { VernaContextProvider } from '@openfun/verna';
import FormWrapper from './FormWrapper';

function App() {
  const schemaDefault: JSONSchema7 = {
    title: 'A registration form',
    description: 'Desc registration form',
    type: 'object',
    properties: {
      testSection: {
        type: 'object',
        title: 'Sectiontest',
        properties: {
          field1: {
            type: 'string',
            title: 'Field name 1',
            propertyNames: true,
          },
        },
      },
      secondSection: {
        type: 'object',
        title: 'Second section',
        properties: {
          secondField: {
            type: 'string',
            title: 'field second section',
          },
        },
      },
    },
  };

  const formData = {
    secondSection: {
      secondField: 'BBBBB',
    },
    testSection: {
      field1: 'AAAAAAAA',
    },
  };

  const widgets = {};
  const uiSchema: UiSchema = {
    'ui:options': {
      orderable: true,
      addable: true,
    },
  };

  return (
    <div style={{ backgroundColor: 'lightgray' }}>
      <VernaContextProvider
        defaultSchema={schemaDefault}
        defaultUiSchema={uiSchema}
        defaultFormValues={formData}
        defaultReadOnly={false}
        defaultWidgets={widgets}
      >
        <FormWrapper />
      </VernaContextProvider>
    </div>
  );
}

export default App;
