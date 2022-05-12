import Form, { type ISubmitEvent, type UiSchema } from '@rjsf/core';
import { useVerna } from '../../providers/VernaProvider';
import { FormEvent, useMemo } from 'react';
import { getUiWidgetName } from '../../utils/utils';
import { RJSF_ID_SEPARATOR } from '../../settings';
import type VernaJSONSchemaType from '../../types/rjsf';
import { Properties, updateWidgetProperties } from '../../utils/schema';
import { useIntl } from 'react-intl';
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
  const { formatMessage } = useIntl();
  const templateName = getUiWidgetName(id, verna.uiSchema);

  function handleSubmit(event: ISubmitEvent<unknown>, nativeEvent: FormEvent<HTMLFormElement>) {
    nativeEvent.preventDefault();
    updateWidgetProperties(event.formData as Properties, verna, id);
    onClose();
    return false;
  }

  const schema = useMemo(() => {
    const translatedSchema =
      verna.configSchema?.properties?.[templateName] || ({} as VernaJSONSchemaType);

    if (translatedSchema.properties) {
      for (const [key, value] of Object.entries(translatedSchema.properties)) {
        value.title = formatMessage({ id: key });
      }
    }
    return translatedSchema;
  }, [verna.configSchema?.properties?.[templateName]]);

  const uiSchema: UiSchema = {
    SelectWidget: {
      items: {
        'ui:options': {
          addable: true,
          orderable: true,
        },
      },
    },
    'ui:submitButtonOptions': {
      norender: false,
      props: {
        className: 'btn btn-save-parameters',
      },
      submitText: formatMessage({ id: 'saveParameters' }),
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
      schema={schema}
      showErrorList={false}
      uiSchema={uiSchema}
    />
  );
}
