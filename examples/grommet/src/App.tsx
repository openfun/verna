import { useState } from 'react';
import { VernaProvider } from '@openfun/verna';
import FormWrapper from './FormWrapper';
import './styles/verna.scss';
import transformErrors from './ErrorCustom';
import { schema, uiSchema } from './data/schemas';
import { configSchema, widgets } from './data/conf';
import { translations, translationUi } from './data/translations';

function App() {
  const [locale, setLocale] = useState('en');
  const [isEditor, setIsEditor] = useState(true);
  const localData = JSON.parse(localStorage.getItem('vernaExampleData-schema') || '{}');
  const localFormData = JSON.parse(localStorage.getItem('vernaExampleData-formData') || '{}');
  const doesLocalDataExist = Object.keys(localData).length !== 0;

  return (
    <VernaProvider
      configSchema={configSchema}
      defaultFormValues={localFormData}
      defaultLocale={locale}
      defaultSchema={doesLocalDataExist ? localData.schema : schema}
      defaultUiSchema={doesLocalDataExist ? localData.uiSchema : uiSchema}
      defaultWidgets={widgets}
      isEditor={isEditor}
      locale={locale}
      transformErrors={transformErrors}
      translationUi={locale === 'fr' ? translationUi : undefined}
      translations={doesLocalDataExist ? localData.schemaTranslations : translations}
    >
      <FormWrapper setIsEditor={setIsEditor} setLocale={setLocale} />
    </VernaProvider>
  );
}

export default App;
