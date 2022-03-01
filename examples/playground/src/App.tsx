import type { JSONSchema7 } from 'json-schema';
import type { UiSchema } from '@rjsf/core';
import { VernaContextProvider } from '@openfun/verna';
import FormWrapper from './FormWrapper';

function App() {
  const schemaDefault: JSONSchema7 = {
    title: 'A registration form',
    description: 'Desc registration form',
    type: 'object',
    properties: {},
  };

  const widgets = {};
  const uiSchema: UiSchema = {
    'ui:options': {
      orderable: true,
      addable: true,
    },
  };

  return (
    <div style={{ backgroundColor: 'lightcyan' }}>
      <VernaContextProvider
        defaultSchema={schemaDefault}
        defaultUiSchema={uiSchema}
        defaultReadOnly={false}
        defaultWidget={widgets}
      >
        <FormWrapper />
      </VernaContextProvider>
    </div>
  );
}

export default App;
