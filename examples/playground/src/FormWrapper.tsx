import { useVerna, VernaForm, VernaToolbar } from '@openfun/verna';
import { JSONSchema7 } from 'json-schema';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocale } from './providers/LocaleProvider';
import CheckboxesWidget from './widgetToolbarItems/CheckboxesWidget';
import CheckboxWidget from './widgetToolbarItems/CheckboxWidget';
import NumberWidget from './widgetToolbarItems/NumberWidget';
import PasswordWidget from './widgetToolbarItems/PasswordWidget';
import QuizWidget from './widgetToolbarItems/QuizWidget';
import SelectWidget from './widgetToolbarItems/SelectWidget';
import TextareaWidget from './widgetToolbarItems/TextareaWidget';
import TextWidget from './widgetToolbarItems/TextWidget';

interface FormWrapperProps {
  toggleEditorMode: () => void;
}

const messages = defineMessages({
  editorOptions: {
    defaultMessage: 'Editor options',
    description: 'Title of the editor options block',
    id: 'components.FormWrapper.editorOptions',
  },
  language: {
    defaultMessage: 'Language',
    description: 'Title of the language selection block',
    id: 'components.FormWrapper.language',
  },
  saveForm: {
    defaultMessage: 'Save form',
    description: 'Label of the save button',
    id: 'components.FormWrapper.saveForm',
  },
  sectionName: {
    defaultMessage: 'Section {name}',
    description: 'Label of a the button to select a section',
    id: 'components.FormWrapper.sectionName',
  },
  selectSection: {
    defaultMessage: 'Select a section',
    description: 'Title of the section selection block',
    id: 'components.FormWrapper.selectSection',
  },
  turnOffEditorMode: {
    defaultMessage: 'Switch to preview mode',
    description: 'Label of the button to switch to preview mode',
    id: 'components.FormWrapper.turnOffEditorMode',
  },
  turnOnEditorMode: {
    defaultMessage: 'Switch to editor mode',
    description: 'Label of the button to switch to editor mode',
    id: 'components.FormWrapper.turnOnEditorMode',
  },
});

export default function FormWrapper({ toggleEditorMode }: FormWrapperProps) {
  const { schema, uiSchema, setSelector, isEditor, selector, schemaTranslations } = useVerna();
  const [locale, setLocale] = useLocale();

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
      <VernaForm onSubmit={console.log} />
      <div className="buttons-wrapper">
        <fieldset>
          <legend>
            <FormattedMessage {...messages.selectSection} />
          </legend>
          {!selector &&
            Object.keys(schema.properties as JSONSchema7)?.map((key) => (
              <button key={key} onClick={() => setSelector(key)}>
                <FormattedMessage {...messages.sectionName} values={{ name: key }} />
              </button>
            ))}
          <button onClick={() => setSelector(undefined)}>Root</button>
        </fieldset>
        <fieldset>
          <legend>
            <FormattedMessage {...messages.language} />
          </legend>
          <select onChange={(e) => setLocale(e.target.value)}>
            <option selected={locale === 'en-US'} value="en-US">
              English
            </option>
            <option selected={locale === 'fr-FR'} value="fr-FR">
              Français
            </option>
          </select>
        </fieldset>
        <fieldset style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <legend>
            <FormattedMessage {...messages.editorOptions} />
          </legend>
          <button onClick={toggleEditorMode}>
            <FormattedMessage
              {...(isEditor ? messages.turnOffEditorMode : messages.turnOnEditorMode)}
            />
          </button>
          <button
            onClick={() =>
              console.log('FormData:', {
                schema: schema,
                translations: schemaTranslations,
                uiSchema: uiSchema,
              })
            }
          >
            <FormattedMessage {...messages.saveForm} />
          </button>
        </fieldset>
      </div>
    </div>
  );
}
