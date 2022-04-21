import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import Form, { type ISubmitEvent, type UiSchema } from '@rjsf/core';
import { useVerna } from '../../context/VernaContextProvider';
import { FormEvent } from 'react';
import WidgetParametersApplyer, { WidgetParameters } from './WidgetParametersApplyer';
import { getTemplateWidgetName, SEPARATOR_ID_RJSF } from '../../utils';

interface WidgetParametersConfigurationProps {
  onClose: () => void;
  widgetId: string;
}

export default function WidgetParametersConfiguration({
  widgetId,
  onClose,
}: WidgetParametersConfigurationProps) {
  const verna = useVerna();
  const templateWidgetName = getTemplateWidgetName(widgetId, verna.uiSchema);

  function handleSubmit(event: ISubmitEvent<unknown>, nativeEvent: FormEvent<HTMLFormElement>) {
    nativeEvent.preventDefault();
    WidgetParametersApplyer(event.formData as WidgetParameters, verna, widgetId);
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

  function getDefaultParameterValues() {
    const widgetIdParts = widgetId.split(SEPARATOR_ID_RJSF);
    const currentWidgetName = widgetIdParts[verna.selector ? 1 : 2];
    const currentSection = ((verna.selector
      ? verna.schema
      : verna.schema.properties?.[widgetIdParts[1]]) || {}) as {
      [key: string]: JSONSchema7Definition;
    };
    const self =
      ((verna.selector
        ? currentSection?.[widgetIdParts[1]]
        : (currentSection as JSONSchema7)?.properties?.[widgetIdParts[2]]) as JSONSchema7) || {};

    return {
      items: self.enum,
      maxLength: self.maxLength,
      minLength: self.minLength,
      required:
        currentSection.required &&
        (currentSection.required as string[]).includes(currentWidgetName),
    };
  }

  const formData = getDefaultParameterValues();

  return (
    <Form
      name="parameter-form"
      className="widget-parameters-wrapper"
      schema={(verna.configSchema?.properties?.[templateWidgetName] as JSONSchema7) || {}}
      uiSchema={uiSchema}
      formData={formData}
      onSubmit={handleSubmit}
    >
      <button type="submit" name="parameter-form">
        Save
      </button>
    </Form>
  );
}
