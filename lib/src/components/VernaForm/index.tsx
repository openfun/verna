import Form from '@rjsf/core';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { useVerna } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { translateSchema } from ':/utils/translation';

interface VernaFormProperties {
  onSubmit: (formData: unknown) => void;
}

function VernaForm({ onSubmit }: VernaFormProperties) {
  const {
    FieldTemplate,
    SubmitButton,
    handleSubmit,
    isEditor,
    schema,
    selectedFormData,
    selector,
    transformErrors,
    uiSchema,
    widgets,
  } = useVerna();
  const { locale, formatMessage } = useIntl();
  const formSchema = useMemo(
    () => translateSchema(schema, formatMessage, selector),
    [locale, schema],
  );

  return (
    <Form
      FieldTemplate={FieldTemplate}
      className="form"
      disabled={isEditor}
      formData={selectedFormData}
      idSeparator={RJSF_ID_SEPARATOR}
      liveValidate={!isEditor}
      onSubmit={handleSubmit(onSubmit)}
      schema={formSchema}
      showErrorList={false}
      tagName={isEditor ? 'div' : undefined}
      transformErrors={transformErrors}
      uiSchema={uiSchema}
      widgets={widgets}
    >
      {SubmitButton}
    </Form>
  );
}

VernaForm.defaultProps = {
  onSubmit: () => undefined,
};

export default VernaForm;
