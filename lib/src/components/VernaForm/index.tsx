import Form from '@rjsf/core';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useVerna } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import VernaJSONSchemaType from ':/types/rjsf';
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
    widgets,
  } = useVerna();
  const { locale, formatMessage } = useIntl();
  const translatedFormSchema: VernaJSONSchemaType = useMemo(() => {
    const translatedSchema = translateSchema(schema, formatMessage);
    return selector
      ? translatedSchema.properties![selector as keyof typeof translatedSchema.properties]
      : translatedSchema;
  }, [locale, schema.formSchema, selector]);

  function getUiSchema() {
    return selector ? schema.uiSchema?.[selector] : schema.uiSchema;
  }

  return (
    <Form
      FieldTemplate={FieldTemplate}
      className="form"
      disabled={isEditor}
      formData={selectedFormData}
      idSeparator={RJSF_ID_SEPARATOR}
      liveValidate={!isEditor}
      onSubmit={handleSubmit(onSubmit)}
      schema={translatedFormSchema}
      showErrorList={false}
      tagName={isEditor ? 'div' : undefined}
      transformErrors={transformErrors}
      uiSchema={getUiSchema()}
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
