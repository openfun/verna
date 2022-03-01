import { useVerna } from './VernaContextProvider';
import Form from '@rjsf/core';
import RenderFieldTemplate from './RenderMethods/RenderFieldTemplate';
import { type FormProps } from '@rjsf/core';

interface VernaFormProperties {
  onSubmit?: FormProps<unknown>['onSubmit'];
}

function VernaForm({ onSubmit }: VernaFormProperties) {
  const { schema, uiSchema, readOnly, widgets } = useVerna();

  return (
    <Form
      className={'form'}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      readonly={readOnly}
      widgets={widgets}
      FieldTemplate={RenderFieldTemplate}
    />
  );
}

export default VernaForm;
