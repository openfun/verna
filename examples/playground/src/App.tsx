import { useState } from 'react';
import type { JSONSchema7 } from 'json-schema';
import type { UiSchema } from '@rjsf/core';
import { VernaContextProvider } from '@openfun/verna';
import FormWrapper from './FormWrapper';
import TextWidget from './widgets/TextWidget';
import PasswordWidget from './widgets/PasswordWidget';
import QuizWidget from './widgets/QuizWidget';
import './styles/verna.scss';

function App() {
  const schemaDefault: JSONSchema7 = {
    description: 'Desc registration form',
    properties: {},
    title: 'A registration form',
    type: 'object',
  };

  const formData = {};

  const widgets = {
    passwordWidget: PasswordWidget,
    quizWidget: QuizWidget,
    textWidget: TextWidget,
  };

  // TODO: Add management for ui:ObjectFieldTemplate saving
  const uiSchema: UiSchema = {};

  const [isEditor, setIsEditor] = useState(true);

  const toggleEditorMode = () => setIsEditor(!isEditor);

  return (
    <div style={{ backgroundColor: 'lightgray' }}>
      <VernaContextProvider
        defaultSchema={schemaDefault}
        defaultUiSchema={uiSchema}
        defaultFormValues={formData}
        defaultWidgets={widgets}
        isEditor={isEditor}
      >
        <FormWrapper toggleEditorMode={toggleEditorMode} />
      </VernaContextProvider>
    </div>
  );
}

export default App;
