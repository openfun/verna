import { VernaContextProps } from '../../context/VernaContextProvider';
import { SEPARATOR_ID_RJSF } from '../../utils';

type Maybe<T> = T | undefined;
type Parameters = {
  items: Maybe<string[]>;
  required: Maybe<boolean>;
  maxLength: Maybe<number>;
};
type ParameterType = Parameters[keyof Parameters];

function updateRequiredValidator(
  newValue: Parameters['required'],
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
        if (newValue) {
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
  newValue: Parameters['maxLength'],
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
          widget.maxLength = newValue as number;
        }
      }
    }
  }
  verna.setSchema(newSchema);
}

function updateItemsValidator(
  newValue: Parameters['items'],
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
          widget.enum = newValue as string[];
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

type ApplierFunction<T> = (newValue: T, verna: VernaContextProps, widgetIdParts: string[]) => void;

type ParameterApplyer = {
  [key in keyof Parameters]: ApplierFunction<Parameters[key]>;
};

const parametersApplyer: ParameterApplyer = {
  items: updateItemsValidator,
  maxLength: updateMaxLengthValidator,
  required: updateRequiredValidator,
  // maximum:,
  // minimum:,
};

export default function WidgetParametersApplyer(
  parameters: WidgetParameters,
  verna: VernaContextProps,
  widgetId: string,
) {
  const widgetIdParts = widgetId.split(SEPARATOR_ID_RJSF);
  widgetIdParts.shift();

  const applyParams = (key: keyof Parameters) => {
    const func = parametersApplyer[key] as ApplierFunction<ParameterType>;
    const value = parameters[key];
    func(value, verna, widgetIdParts);
  };

  const params = Object.keys(parametersApplyer);
  params.forEach((key) => applyParams(key as keyof Parameters));
}
