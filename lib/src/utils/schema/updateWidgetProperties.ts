import _ from 'lodash';
import { updateProperty, updateRequired } from './widgetPropertyUpdaters';
import { VernaContextProps } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { defaultWidgetProps } from ':/templates';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';
import { getSectionName, getUiWidgetName } from ':/utils';
import { getSection } from ':/utils/schema/getSection';

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
  verna: VernaContextProps,
  value: T,
  section: VernaJSONSchemaType,
  widgetPath: string[],
  locale: string,
) => VernaJSONSchemaType;

type PropertyUpdaters = {
  [key in keyof Properties]: PropertyUpdater<Properties[key]>;
};

const propertyUpdaters: PropertyUpdaters = {
  description: (verna, value, section, widgetPath, locale) =>
    updateProperty('description', value, verna, widgetPath, locale, section),
  enum: (verna, value, section, widgetPath, locale) =>
    updateProperty('enum', value, verna, widgetPath, locale, section),
  items: (verna, value, section, widgetPath, locale) =>
    updateProperty('items', value, verna, widgetPath, locale, section),
  maxLength: (verna, value, section, widgetPath, locale) =>
    updateProperty('maxLength', value, verna, widgetPath, locale, section),
  maximum: (verna, value, section, widgetPath, locale) =>
    updateProperty('maximum', value, verna, widgetPath, locale, section),
  minimum: (verna, value, section, widgetPath, locale) =>
    updateProperty('minimum', value, verna, widgetPath, locale, section),
  required: updateRequired,
  title: (verna, value, section, widgetPath, locale) =>
    updateProperty('title', value, verna, widgetPath, locale, section),
};

function rebuildSchema(
  verna: VernaContextProps,
  section: VernaJSONSchemaType,
  id: string,
): VernaSchemaType {
  if (verna.selector) {
    return {
      formSchema: {
        properties: {
          [verna.selector]: section,
        },
      },
    };
  }
  const sectionName = getSectionName(id);
  if (!sectionName) {
    return { formSchema: section };
  }
  return {
    formSchema: {
      properties: {
        [sectionName]: section,
      },
    },
  };
}

/**
 * This function will update the value of each property by calling the corresponding updater
 * defined through propertyUpdaters object. The key must match the name of
 * the field on the configSchema
 */
export function updateWidgetProperties(
  properties: Properties,
  verna: VernaContextProps,
  id: string,
  locale: string,
) {
  const widgetIdParts = id.split(RJSF_ID_SEPARATOR);
  const templateName = getUiWidgetName(id, verna.schema.uiSchema || {});
  const widgetPropsKeys = Object.keys({
    ...verna.configSchema?.properties?.[templateName]?.properties,
    ...defaultWidgetProps,
  });
  let section = _.cloneDeep(getSection(verna.selector, verna.schema.formSchema!, id));

  const updateProperty = (key: keyof Properties) => {
    const updater = propertyUpdaters[key] as PropertyUpdater<PropertyName>;
    const value = properties[key];

    section = updater(verna, value, section, widgetIdParts, locale);
  };

  widgetPropsKeys.forEach((key) => updateProperty(key as keyof Properties));
  verna.updateVernaProperty(rebuildSchema(verna, section, id));
}
