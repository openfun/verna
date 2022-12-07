import { VernaProvider } from '@openfun/verna';
import type { AjvError } from '@rjsf/core';
import { Grommet } from 'grommet';
import { Suspense, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import FormWrapper from './components/FormWrapper/FormWrapper';
import DropZone from './components/VernaOverride/DropZone';
import FieldTemplate from './components/VernaOverride/FieldTemplate';
import Section from './components/VernaOverride/Section';
import { configSchema, widgets } from './data/conf';
import transformErrors from './ErrorCustom';
import SubmitButton from ':/components/VernaOverride/SubmitButton';
import './styles/verna.scss';

const messages = defineMessages({
  loading: {
    defaultMessage: 'Loading...',
    description: 'Message displayed while verna is loading',
    id: 'components.App.loading',
  },
  title: {
    defaultMessage: '🧑‍💻 Verna poll builder with Grommet Library',
    description: 'Title of the playground application',
    id: 'components.App.title',
  },
});

function App() {
  const [isEditor, setIsEditor] = useState(
    JSON.parse(localStorage.getItem('vernaExampleData-isEditor') || 'true'),
  );
  const intl = useIntl();

  function transformErrorsOverload(errors: AjvError[]): AjvError[] {
    return transformErrors(errors, intl.formatMessage);
  }

  useEffect(() => {
    localStorage.setItem('vernaExampleData-isEditor', JSON.stringify(isEditor));
  }, [isEditor]);

  return (
    <Grommet
      theme={{
        formField: {
          border: {
            side: 'all',
          },
          label: {
            margin: {
              left: '0',
            },
            requiredIndicator: true,
          },
          round: 'xsmall',
        },
        icon: {
          size: {
            medium: '20px',
          },
        },
        tip: {
          drop: {
            background: '#ffffff',
            round: 'large',
          },
        },
      }}
    >
      <h1 style={{ marginLeft: '15px' }}>
        <FormattedMessage {...messages.title} />
      </h1>
      <Suspense fallback={<FormattedMessage {...messages.loading} />}>
        <VernaProvider
          DropZone={DropZone}
          FieldTemplate={FieldTemplate}
          Section={Section}
          SubmitButton={<SubmitButton />}
          configSchema={configSchema}
          defaultWidgets={widgets}
          intl={intl}
          isEditor={isEditor}
          transformErrors={transformErrorsOverload}
        >
          <FormWrapper setIsEditor={setIsEditor} />
        </VernaProvider>
      </Suspense>
    </Grommet>
  );
}

export default App;
