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

  const formData = {};

  const [isEditor, setIsEditor] = useState(true);

  return (
    <VernaProvider
      configSchema={configSchema}
      defaultFormValues={formData}
      defaultLocale={locale}
      defaultSchema={schema}
      defaultUiSchema={uiSchema}
      defaultWidgets={widgets}
      isEditor={isEditor}
      locale={locale}
      transformErrors={transformErrors}
      translationUi={locale === 'fr' ? translationUi : undefined}
      translations={translations}
    >
      <FormWrapper setIsEditor={setIsEditor} setLocale={setLocale} />
    </VernaProvider>
  );
}

export default App;
