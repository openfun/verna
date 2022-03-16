import Form from '@rjsf/core';
import { useVerna } from './context/VernaContextProvider';
import RenderEditorFieldTemplate from './RenderMethods/RenderEditorFieldTemplate';

interface VernaFormProperties {
  onSubmit: (formData: unknown) => void;
}

function VernaForm({ onSubmit }: VernaFormProperties) {
  const { schema, uiSchema, widgets, selectedFormData, handleSubmit } = useVerna();

  return (
    <Form
      className="form"
      schema={schema}
      uiSchema={uiSchema}
      formData={selectedFormData}
      onSubmit={handleSubmit(onSubmit)}
      widgets={widgets}
      FieldTemplate={RenderEditorFieldTemplate}
    />
  );
}

VernaForm.defaultProps = {
  onSubmit: () => undefined,
};

export default VernaForm;
