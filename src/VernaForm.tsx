import Form from '@rjsf/core';
import { useVerna } from './context/VernaContextProvider';
import RenderFieldTemplate from './RenderMethods/RenderFieldTemplate';

interface VernaFormProperties {
  onSubmit: (formData: unknown) => void;
}

function VernaForm({ onSubmit }: VernaFormProperties) {
  const { schema, uiSchema, widgets, selectedFormData, handleSubmit, isEditor } = useVerna();

  return (
    <Form
      name="verna-form"
      tagName={isEditor ? 'div' : undefined}
      className="form"
      schema={schema}
      uiSchema={uiSchema}
      formData={selectedFormData}
      onSubmit={handleSubmit(onSubmit)}
      widgets={widgets}
      disabled={isEditor}
      FieldTemplate={RenderFieldTemplate}
      liveValidate={!isEditor}
    >
      <button type="submit" name="verna-form">
        Save
      </button>
    </Form>
  );
}

VernaForm.defaultProps = {
  onSubmit: () => undefined,
};

export default VernaForm;
