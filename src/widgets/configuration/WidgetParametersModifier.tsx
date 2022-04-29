import { VernaContextProps } from '../../context/VernaContextProvider';
import { RJSF_ID_SEPARATOR } from '../../settings';
import {
  updateEnumValidator,
  updateItemsValidator,
  updateMaximumValidator,
  updateMaxLengthValidator,
  updateMinimumValidator,
  updateRequiredValidator,
} from './WidgetParameterModifierMethods';

type Maybe<T> = T | undefined;
export type Parameters = {
  items: Maybe<string[]>;
  enum: Maybe<string[]>;
  required: Maybe<boolean>;
  maxLength: Maybe<number>;
  maximum: Maybe<number>;
  minimum: Maybe<number>;
};
type ParameterType = Parameters[keyof Parameters];

type WidgetParameterModifier<T> = (
  value: T,
  verna: VernaContextProps,
  widgetIdParts: string[],
) => void;

type ParameterModifier = {
  [key in keyof Parameters]: WidgetParameterModifier<Parameters[key]>;
};

const parametersModifier: ParameterModifier = {
  enum: updateEnumValidator,
  items: updateItemsValidator,
  maxLength: updateMaxLengthValidator,
  maximum: updateMaximumValidator,
  minimum: updateMinimumValidator,
  required: updateRequiredValidator,
};

export default function WidgetParametersModifier(
  parameters: Parameters,
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
