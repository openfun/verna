import { VernaContextProps } from '../../providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from '../../settings';
import {
  updateEnum,
  updateItems,
  updateMaximum,
  updateMaxLength,
  updateMinimum,
  updateRequired,
} from './widgetPropertyUpdaters';

type Maybe<T> = T | undefined;
export type Properties = {
  items: Maybe<string[]>;
  enum: Maybe<string[]>;
  required: Maybe<boolean>;
  maxLength: Maybe<number>;
  maximum: Maybe<number>;
  minimum: Maybe<number>;
};
type PropertyName = Properties[keyof Properties];

/**
 * The WidgetParameterModifier type is the prototype used to apply any
 * parameter set in the parametersModifier
 */
type PropertyUpdater<T> = (value: T, verna: VernaContextProps, widgetPath: string[]) => void;

type PropertyUpdaters = {
  [key in keyof Properties]: PropertyUpdater<Properties[key]>;
};

const propertyUpdaters: PropertyUpdaters = {
  enum: updateEnum,
  items: updateItems,
  maxLength: updateMaxLength,
  maximum: updateMaximum,
  minimum: updateMinimum,
  required: updateRequired,
};

/**
 * This function will update the value of each property by calling the corresponding updater
 * defined through parametersUpdaters object. The key must match the name of
 * the field on the configSchema
 */
export function updateWidgetProperties(
  properties: Properties,
  verna: VernaContextProps,
  id: string,
) {
  const [, ...widgetPath] = id.split(RJSF_ID_SEPARATOR);

  const updateProperty = (key: keyof Properties) => {
    const updater = propertyUpdaters[key] as PropertyUpdater<PropertyName>;
    const value = properties[key];
    updater(value, verna, widgetPath);
  };

  const params = Object.keys(propertyUpdaters);
  params.forEach((key) => updateProperty(key as keyof Properties));
}
