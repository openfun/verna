import VernaForm, { useVerna, VernaToolbar } from '@openfun/verna';
import { JSONSchema7 } from 'json-schema';
import TextWidget from './WidgetToolbarItems/TextWidget';
import PasswordWidget from './WidgetToolbarItems/PasswordWidget';
import QuizWidget from './WidgetToolbarItems/QuizWidget';

interface FormWrapperProps {
  toggleEditorMode: () => void;
}

export default function FormWrapper({ toggleEditorMode }: FormWrapperProps) {
  const { schema, uiSchema, setSelector, isEditor, selector } = useVerna();

  return (
    <div className="verna-wrapper">
      {isEditor && (
        <div className="widget-wrapper">
          <VernaToolbar>
            <TextWidget widgetName="textWidget" type="string" />
            <PasswordWidget widgetName="passwordWidget" type="string" />
            <QuizWidget widgetName="quizWidget" type="string" />
          </VernaToolbar>
        </div>
      )}
      <VernaForm onSubmit={(formData) => console.log(formData)} />
      <div className="buttons-wrapper">
        <button onClick={toggleEditorMode}>Switch editor mode</button>
        <button onClick={() => console.log('Schema:', { schema: schema, uiSchema: uiSchema })}>
          save form
        </button>
        <fieldset>
          <legend>Select a section</legend>
          {!selector &&
            Object.keys(schema.properties as JSONSchema7)?.map((key) => (
              <button onClick={() => setSelector(key)} key={key}>
                Section {key}
              </button>
            ))}
          <button onClick={() => setSelector(undefined)}>Root</button>
        </fieldset>
      </div>
    </div>
  );
}
