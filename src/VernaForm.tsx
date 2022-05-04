import Form from '@rjsf/core';
import { useVerna } from './context/VernaContextProvider';
import RenderFieldTemplate from './FieldTemplate/RenderFieldTemplate';
import { RJSF_ID_SEPARATOR } from './settings';

interface VernaFormProperties {
  onSubmit: (formData: unknown) => void;
}

function VernaForm({ onSubmit }: VernaFormProperties) {
  const { schema, uiSchema, widgets, selectedFormData, handleSubmit, isEditor, transformErrors } =
    useVerna();

  return (
    <Form
      FieldTemplate={RenderFieldTemplate}
      className="form"
      disabled={isEditor}
      formData={selectedFormData}
      idSeparator={RJSF_ID_SEPARATOR}
      liveValidate={!isEditor}
      onSubmit={handleSubmit(onSubmit)}
      schema={schema}
      tagName={isEditor ? 'div' : undefined}
      transformErrors={transformErrors}
      uiSchema={uiSchema}
      widgets={widgets}
    />
  );
}

VernaForm.defaultProps = {
  onSubmit: () => undefined,
};

export default VernaForm;
