import Form, { type ISubmitEvent, type UiSchema } from '@rjsf/core';
import { defineMessages, useIntl } from 'react-intl';
import { FormEvent, useMemo } from 'react';
import { useVerna } from '../../providers/VernaProvider';
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
  const { formatMessage } = useIntl();
  const templateName = getUiWidgetName(id, verna.uiSchema);

  function handleSubmit(event: ISubmitEvent<unknown>, nativeEvent: FormEvent<HTMLFormElement>) {
    nativeEvent.preventDefault();
    updateWidgetProperties(event.formData as Properties, verna, id);
    onClose();
    return false;
  }

  const messages = defineMessages({
    enum: {
      defaultMessage: 'Options',
      description: 'Fieldset label to add/remove options of a widget using an array of strings',
      id: 'components.WidgetPropertiesForm.enum',
    },
    items: {
      defaultMessage: 'Options',
      description: 'Fieldset label containing customizable options to add widgets as items',
      id: 'components.WidgetPropertiesForm.items',
    },
    maxLength: {
      defaultMessage: 'maximum length',
      description: 'Label of the maximum length input',
      id: 'components.WidgetPropertiesForm.maxLength',
    },
    maximum: {
      defaultMessage: 'maximum',
      description: 'Label of the maximum input',
      id: 'components.WidgetPropertiesForm.maximum',
    },
    minLength: {
      defaultMessage: 'minimum length',
      description: 'Label of the minimum length input',
      id: 'components.WidgetPropertiesForm.minLength',
    },
    minimum: {
      defaultMessage: 'minimum',
      description: 'Label of the minimum input',
      id: 'components.WidgetPropertiesForm.minimum',
    },
    required: {
      defaultMessage: 'required',
      description: 'Label of the required input',
      id: 'components.WidgetPropertiesForm.required',
    },
    submitWidgetParameter: {
      defaultMessage: 'save',
      description: 'Label of submit input',
      id: 'components.WidgetPropertiesForm.submitWidgetParameter',
    },
  });

  const schema = useMemo(() => {
    const translatedSchema =
      verna.configSchema?.properties?.[templateName] || ({} as VernaJSONSchemaType);

    const isMessageKey = (key: PropertyKey): key is keyof typeof messages => {
      return key in messages;
    };

    if (translatedSchema.properties) {
      for (const [key, value] of Object.entries(translatedSchema.properties)) {
        if (isMessageKey(key)) {
          value.title = formatMessage(messages[key]);
        }
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
      submitText: formatMessage(messages.submitWidgetParameter),
    },
  };

  function getDefaultValues() {
    const path = id.split(RJSF_ID_SEPARATOR);
    const widgetName = path[verna.selector ? 1 : 2];
    const currentSection: VernaJSONSchemaType =
      (verna.selector ? verna.schema : verna.schema.properties?.[path[1]]) || {};
    const self = currentSection?.properties?.[widgetName] || {};

    return {
      enum: self.enum,
      items: self.items && (self.items as VernaJSONSchemaType).enum,
      maxLength: self.maxLength,
      maximum: self.maximum,
      minLength: self.minLength,
      minimum: self.minimum,
      required:
        currentSection.required && (currentSection.required as string[]).includes(widgetName),
    };
  }

  return (
    <Form
      className="widget-properties-form"
      formData={getDefaultValues()}
      idSeparator={RJSF_ID_SEPARATOR}
      onSubmit={handleSubmit}
      schema={schema}
      showErrorList={false}
      uiSchema={uiSchema}
    />
  );
}
