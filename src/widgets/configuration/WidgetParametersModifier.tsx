import { VernaContextProps } from '../../context/VernaContextProvider';
import { RJSF_ID_SEPARATOR } from '../../settings';

type Maybe<T> = T | undefined;
type Parameters = {
  items: Maybe<string[]>;
  required: Maybe<boolean>;
  maxLength: Maybe<number>;
};
type ParameterType = Parameters[keyof Parameters];

function updateRequiredValidator(
  value: Parameters['required'],
  verna: VernaContextProps,
  widgetIdParts: string[],
) {
  const newSchema = { ...verna.schema };
  if (verna.selector) {
    // TODO
  } else {
    if (newSchema.properties) {
      const section = newSchema.properties[widgetIdParts[0]];
      if (section && typeof section !== 'boolean') {
        if (value) {
          section.required = [...(section.required || []), widgetIdParts[1]];
        } else {
          section.required = section.required?.filter((e) => e !== widgetIdParts[1]);
        }
      }
    }
  }
  verna.setSchema(newSchema);
}

function updateMaxLengthValidator(
  value: Parameters['maxLength'],
  verna: VernaContextProps,
  widgetIdParts: string[],
) {
  const newSchema = { ...verna.schema };
  if (verna.selector) {
    // TODO
  } else {
    if (newSchema.properties) {
      const section = newSchema.properties[widgetIdParts[0]];
      if (section && typeof section !== 'boolean') {
        const widget = section.properties?.[widgetIdParts[1]];
        if (widget && typeof widget !== 'boolean') {
          widget.maxLength = value as number;
        }
      }
    }
  }
  verna.setSchema(newSchema);
}

function updateItemsValidator(
  value: Parameters['items'],
  verna: VernaContextProps,
  widgetIdParts: string[],
) {
  const newSchema = verna.schema;
  if (verna.selector) {
    // TODO
  } else {
    if (newSchema.properties) {
      const section = newSchema.properties[widgetIdParts[0]];
      if (section && typeof section !== 'boolean') {
        const widget = section.properties?.[widgetIdParts[1]];
        if (widget && typeof widget !== 'boolean') {
          widget.enum = value as string[];
        }
      }
    }
  }
  verna.setSchema(newSchema);
}

export interface WidgetParameters {
  items: Maybe<string[]>;
  required: Maybe<boolean>;
  maxLength: Maybe<number>;
}

type WidgetParameterModifier<T> = (
  value: T,
  verna: VernaContextProps,
  widgetIdParts: string[],
) => void;

type ParameterModifier = {
  [key in keyof Parameters]: WidgetParameterModifier<Parameters[key]>;
};

const parametersModifier: ParameterModifier = {
  items: updateItemsValidator,
  maxLength: updateMaxLengthValidator,
  required: updateRequiredValidator,
  // maximum:,
  // minimum:,
};

export default function WidgetParametersModifier(
  parameters: WidgetParameters,
  verna: VernaContextProps,
  widgetId: string,
) {
  const widgetIdParts = widgetId.split(RJSF_ID_SEPARATOR);
  widgetIdParts.shift();

  const applyParams = (key: keyof Parameters) => {
    const func = parametersModifier[key] as WidgetParameterModifier<ParameterType>;
    const value = parameters[key];
    func(value, verna, widgetIdParts);
  };

  const params = Object.keys(parametersModifier);
  params.forEach((key) => applyParams(key as keyof Parameters));
}
