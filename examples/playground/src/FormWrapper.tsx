import VernaForm, { useVerna, VernaToolbar } from '@openfun/verna';
import { JSONSchema7 } from 'json-schema';
import TextWidget from './widgetToolbarItems/TextWidget';
import PasswordWidget from './widgetToolbarItems/PasswordWidget';
import QuizWidget from './widgetToolbarItems/QuizWidget';
import TextareaWidget from './widgetToolbarItems/TextareaWidget';
import NumberWidget from './widgetToolbarItems/NumberWidget';
import CheckboxWidget from './widgetToolbarItems/CheckboxWidget';
import SelectWidget from './widgetToolbarItems/SelectWidget';

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
            <TextWidget type="string" widgetName="textWidget" />
            <PasswordWidget type="string" widgetName="passwordWidget" />
            <QuizWidget type="string" widgetName="quizWidget" />
            <TextareaWidget type="string" widgetName="TextareaWidget" />
            <NumberWidget type="number" widgetName="numberWidget" />
            <CheckboxWidget type="boolean" widgetName="CheckboxWidget" />
            <SelectWidget type="string" widgetName="SelectWidget" />
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
              <button key={key} onClick={() => setSelector(key)}>
                Section {key}
              </button>
            ))}
          <button onClick={() => setSelector(undefined)}>Root</button>
        </fieldset>
      </div>
    </div>
  );
}
