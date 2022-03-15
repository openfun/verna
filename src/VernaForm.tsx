import { useVerna } from './VernaContextProvider';
import Form from '@rjsf/core';
import RenderFieldTemplate from './RenderMethods/RenderFieldTemplate';

interface VernaFormProperties {
  onSubmit: (formData: unknown) => void;
}

function VernaForm({ onSubmit }: VernaFormProperties) {
  const { schema, uiSchema, readOnly, widgets, selectedFormData, handleSubmit } = useVerna();

  return (
    <Form
      className="form"
      schema={schema}
      uiSchema={uiSchema}
      formData={selectedFormData}
      onSubmit={handleSubmit(onSubmit)}
      readonly={readOnly}
      widgets={widgets}
      FieldTemplate={RenderFieldTemplate}
    />
  );
}

VernaForm.defaultProps = {
  onSubmit: () => undefined,
};

export default VernaForm;
