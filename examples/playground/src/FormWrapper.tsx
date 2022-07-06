import { useVerna, VernaForm, VernaToolbar } from '@openfun/verna';
import { JSONSchema7 } from 'json-schema';
import { useIntl } from 'react-intl';
import TextWidget from './widgetToolbarItems/TextWidget';
import PasswordWidget from './widgetToolbarItems/PasswordWidget';
import QuizWidget from './widgetToolbarItems/QuizWidget';
import TextareaWidget from './widgetToolbarItems/TextareaWidget';
import NumberWidget from './widgetToolbarItems/NumberWidget';
import CheckboxWidget from './widgetToolbarItems/CheckboxWidget';
import SelectWidget from './widgetToolbarItems/SelectWidget';
import CheckboxesWidget from './widgetToolbarItems/CheckboxesWidget';

interface FormWrapperProps {
  toggleEditorMode: () => void;
  setLocale: (locale: string) => void;
}

export default function FormWrapper({ toggleEditorMode, setLocale }: FormWrapperProps) {
  const { schema, uiSchema, setSelector, isEditor, selector, schemaTranslations } = useVerna();
  const { locale } = useIntl();

  return (
    <div className="verna-wrapper">
      {isEditor && (
        <div className="widget-wrapper">
          <VernaToolbar>
            <TextWidget type="string" widgetName="textWidget" />
            <PasswordWidget type="string" widgetName="passwordWidget" />
            <QuizWidget type="string" widgetName="quizWidget" />
            <TextareaWidget type="string" widgetName="textareaWidget" />
            <NumberWidget type="number" widgetName="numberWidget" />
            <CheckboxWidget type="boolean" widgetName="checkboxWidget" />
            <CheckboxesWidget type="array" widgetName="CheckboxesWidget" />
            <SelectWidget type="string" widgetName="selectWidget" />
          </VernaToolbar>
        </div>
      )}
      <VernaForm onSubmit={(formData) => console.log(formData)} />
      <div className="buttons-wrapper">
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
        <fieldset>
          <legend>Language</legend>
          <select onChange={(e) => setLocale(e.target.value)} value={locale}>
            <option>fr</option>
            <option>en</option>
          </select>
        </fieldset>
        <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <legend>Editor options</legend>
          <button onClick={toggleEditorMode}>Switch editor mode</button>
          <button
            onClick={() =>
              console.log('FormData:', {
                schema: schema,
                translations: schemaTranslations,
                uiSchema: uiSchema,
              })
            }
          >
            save form
          </button>
        </fieldset>
      </div>
    </div>
  );
}
