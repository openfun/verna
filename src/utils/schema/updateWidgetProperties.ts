import { VernaContextProps } from '../../providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from '../../settings';
import { updateProperty, updateRequired } from './widgetPropertyUpdaters';
import VernaJSONSchemaType from '../../types/rjsf';
import _ from 'lodash';

type Maybe<T> = T | undefined;
export type Properties = {
  description: Maybe<string>;
  enum: Maybe<string[]>;
  items: Maybe<VernaJSONSchemaType>;
  maxLength: Maybe<number>;
  maximum: Maybe<number>;
  minimum: Maybe<number>;
  required: Maybe<boolean>;
  title: Maybe<string>;
};
type PropertyName = Properties[keyof Properties];

/**
 * The PropertyUpdater type is the prototype used to apply any
 * parameter set in the parametersModifier
 */
type PropertyUpdater<T> = (
  value: T,
  verna: VernaContextProps,
  widgetPath: string[],
  locale: string,
  newSchema: VernaJSONSchemaType,
) => void;

type PropertyUpdaters = {
  [key in keyof Properties]: PropertyUpdater<Properties[key]>;
};

const propertyUpdaters: PropertyUpdaters = {
  description: (value, verna, widgetPath, locale, newSchema) =>
    updateProperty('description', value, verna, widgetPath, locale, newSchema),
  enum: (value, verna, widgetPath, locale, newSchema) =>
    updateProperty('enum', value, verna, widgetPath, locale, newSchema),
  items: (value, verna, widgetPath, locale, newSchema) =>
    updateProperty('items', value, verna, widgetPath, locale, newSchema),
  maxLength: (value, verna, widgetPath, locale, newSchema) =>
    updateProperty('maxLength', value, verna, widgetPath, locale, newSchema),
  maximum: (value, verna, widgetPath, locale, newSchema) =>
    updateProperty('maximum', value, verna, widgetPath, locale, newSchema),
  minimum: (value, verna, widgetPath, locale, newSchema) =>
    updateProperty('minimum', value, verna, widgetPath, locale, newSchema),
  required: updateRequired,
  title: (value, verna, widgetPath, locale, newSchema) =>
    updateProperty('title', value, verna, widgetPath, locale, newSchema),
};

/**
 * This function will update the value of each property by calling the corresponding updater
 * defined through propertyUpdaters object. The key must match the name of
 * the field on the configSchema
 */
export function updateWidgetProperties(
  properties: Properties,
  verna: VernaContextProps,
  id: string,
  widgetPropsKeys: string[],
  locale: string,
) {
  const widgetPath = id.split(RJSF_ID_SEPARATOR);
  const newSchema = _.cloneDeep(verna.schema);

  const updateProperty = (key: keyof Properties) => {
    const updater = propertyUpdaters[key] as PropertyUpdater<PropertyName>;
    const value = properties[key];
    updater(value, verna, widgetPath, locale, newSchema);
  };

  widgetPropsKeys.forEach((key) => updateProperty(key as keyof Properties));
  verna.setSchema(newSchema);
}
