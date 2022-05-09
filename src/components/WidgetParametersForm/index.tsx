import Form, { type ISubmitEvent, type UiSchema } from '@rjsf/core';
import { useVerna } from '../../providers/VernaProvider';
import { FormEvent } from 'react';
import { getUiWidgetName } from '../../utils/utils';
import { RJSF_ID_SEPARATOR } from '../../settings';
import type VernaJSONSchemaType from '../../types/rjsf';
import { Properties, updateWidgetProperties } from '../../utils/schema';

interface WidgetPropertiesFormProps {
  onClose: () => void;
  id: string;
}

/**
 * This component is used as an edit interface to parameter the linked widget
 * It will render a form by using the RJSF format and on validation
 * it will apply the changes on the widget
 */
export default function WidgetPropertiesForm({ id, onClose }: WidgetPropertiesFormProps) {
  const verna = useVerna();
  const templateName = getUiWidgetName(id, verna.uiSchema);

  function handleSubmit(event: ISubmitEvent<unknown>, nativeEvent: FormEvent<HTMLFormElement>) {
    nativeEvent.preventDefault();
    updateWidgetProperties(event.formData as Properties, verna, id);
    onClose();
    return false;
  }

  const uiSchema: UiSchema = {
    SelectWidget: {
      items: {
        'ui:options': {
          addable: true,
          orderable: true,
        },
      },
    },
  };

  function getDefaultValues() {
    const path = id.split(RJSF_ID_SEPARATOR);
    const currentName = path[verna.selector ? 1 : 2];
    const currentSection: VernaJSONSchemaType =
      (verna.selector ? verna.schema : verna.schema.properties?.[path[1]]) || {};
    const self = (verna.selector ? currentSection : currentSection?.properties?.[path[2]]) || {};

    return {
      enum: self.enum,
      items: self.items && (self.items as VernaJSONSchemaType).enum,
      maxLength: self.maxLength,
      maximum: self.maximum,
      minLength: self.minLength,
      minimum: self.minimum,
      required:
        currentSection.required && (currentSection.required as string[]).includes(currentName),
    };
  }

  return (
    <Form
      className="widget-parameters-wrapper"
      formData={getDefaultValues()}
      idSeparator={RJSF_ID_SEPARATOR}
      onSubmit={handleSubmit}
      schema={verna.configSchema?.properties?.[templateName] || {}}
      showErrorList={false}
      uiSchema={uiSchema}
    />
  );
}
