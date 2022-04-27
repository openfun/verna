import { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import Form, { type ISubmitEvent, type UiSchema } from '@rjsf/core';
import { useVerna } from '../../context/VernaContextProvider';
import { FormEvent } from 'react';
import WidgetParametersModifier, { WidgetParameters } from './WidgetParametersModifier';
import { getTemplateWidgetName } from '../../utils';
import { RJSF_ID_SEPARATOR } from '../../settings';

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
    WidgetParametersModifier(event.formData as WidgetParameters, verna, widgetId);
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
    const widgetIdParts = widgetId.split(RJSF_ID_SEPARATOR);
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
      className="widget-parameters-wrapper"
      formData={formData}
      idSeparator={RJSF_ID_SEPARATOR}
      onSubmit={handleSubmit}
      schema={(verna.configSchema?.properties?.[templateWidgetName] as JSONSchema7) || {}}
      uiSchema={uiSchema}
    />
  );
}
