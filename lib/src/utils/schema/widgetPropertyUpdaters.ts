import _ from 'lodash';
import { v4 as uuid } from 'uuid';
import type { Properties } from './updateWidgetProperties';
import { VernaContextProps } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import VernaJSONSchemaType from ':/types/rjsf';
import { Maybe } from ':/types/utils';

/**
 * Generate the translation key based on those parameters
 * The key is built on the id of the widget (cd: "root_section_widget") with the name of
 * the property translated
 *
 * @param widgetPath is the decomposed id of the widget
 * @param propertyKey is the name of the property we are generating a key for
 * @param selector is the name of the selected section if there is one
 */
function getTranslationKey(widgetPath: string[], propertyKey: string, selector: Maybe<string>) {
  if (selector) {
    const [root, ...path] = widgetPath;
    const translationKeyParts = [root, selector, path, propertyKey];
    return translationKeyParts.join(RJSF_ID_SEPARATOR);
  } else {
    return [...widgetPath, propertyKey].join(RJSF_ID_SEPARATOR);
  }
}

function updateItemsTranslations(widget: VernaJSONSchemaType, translationKeys: string[]) {
  if (Array.isArray(widget.items)) {
    // TODO: add other properties management & matching between those and translation keys
    widget.items = translationKeys.map((key: string) => {
      return {
        enum: [key],
      };
    });
  } else {
    widget.items!.enum = translationKeys;
  }
}

/**
 * Retrieve unchanged, removed, updated and new translation keys
 *
 * @param filteredTranslationEntries array of translation keys linked to this widget
 * @param values The value is a list of strings that we set to this key
 * @param translationKey the corresponding key used in the translation object
 */
function getTranslationState(
  filteredTranslationEntries: [string, string][],
  values: string[],
  translationKey: string,
) {
  const state = filteredTranslationEntries.reduce(
    (state, [key, message]) => {
      if (values.includes(message)) {
        state.unchanged[key] = message;
      } else {
        state.removed.push(key);
      }

      return state;
    },
    {
      new: {} as { [key: string]: string },
      removed: [] as string[],
      unchanged: {} as { [key: string]: string },
      updated: {} as { [key: string]: string },
    },
  );

  // Now check which entries have been added or updated
  const unchangedMessages = Object.values(state.unchanged);
  let newValues = values.filter((value) => !unchangedMessages.includes(value));
  if (values.length >= filteredTranslationEntries.length) {
    state.updated = state.removed.reduce(
      (updatedMessages, key, index) => ({
        ...updatedMessages,
        [key]: newValues[index],
      }),
      {},
    );
    state.removed = [];
    const updatedValues = Object.values(state.updated);
    newValues = newValues.filter((v) => !updatedValues.includes(v));
  }

  state.new = newValues.reduce(
    (newMessages, value) => ({
      ...newMessages,
      [`${translationKey}_${uuid()}`]: value,
    }),
    {},
  );

  return state;
}

/**
 * Update the translations for an enum
 * Each value has a unique translation key
 *
 * @param propertyKey The key of the property to modify
 * @param widget The schema part representing the current widget
 * @param verna The verna context, used to update the rendered schema and the translations
 * @param values The value is a list of strings that we set to this key
 * @param translationKey the corresponding key used in the translation object
 * @param locale The current locale loaded
 */
function updateEnumTranslations(
  propertyKey: keyof VernaJSONSchemaType,
  widget: VernaJSONSchemaType,
  verna: VernaContextProps,
  values: string[],
  translationKey: string,
  locale: string,
) {
  // Get the translation keys existing in every locale then filter the ones linked to this widget
  const everyTranslationKeys = Object.entries(verna.schema.translationSchema || {})
    .flatMap(([, translations]) => Object.entries(translations))
    .filter(([key]) => key.includes(translationKey));
  const uniqTranslationKeys = _.uniqWith(everyTranslationKeys, ([keyA], [keyB]) =>
    _.isEqual(keyA, keyB),
  );

  const translationState = getTranslationState(uniqTranslationKeys, values, translationKey);

  // Remove unused keys
  if (translationState.removed.length > 0) {
    verna.removeVernaTranslations(translationState.removed);
  }

  // Update translationSchema with new and updated keys
  if (translationState.new || translationState.updated) {
    if (!verna.schema?.translationSchema) verna.schema.translationSchema = { [locale]: {} };
    if (!Object.keys(verna.schema.translationSchema).includes(locale))
      verna.schema.translationSchema[locale] = {};
    const allLocales = Object.keys(verna.schema.translationSchema);
    verna.addVernaTranslations(
      allLocales.reduce(
        (locales, currentLocale) => ({
          ...locales,
          [currentLocale]: {
            ...translationState.new,
            ...(currentLocale === locale && translationState.updated),
          },
        }),
        {},
      ),
    );
  }

  // In case of enum or items, bind it new translation keys
  if (['enum', 'items'].includes(propertyKey)) {
    const translationsEntries = Object.entries({
      ...translationState.new,
      ...translationState.unchanged,
      ...translationState.updated,
    });

    const translationKeys = values.map((value) => {
      const translation = translationsEntries.find(([, message]) => message === value);
      return translation![0];
    });

    if (propertyKey === 'enum') {
      widget.enum = translationKeys;
    } else if (propertyKey === 'items') {
      updateItemsTranslations(widget, translationKeys);
    }
  }

  return widget;
}

/**
 * Update the translation object and the corresponding widget to add the translated value
 *
 * @param propertyKey The key of the property to modify
 * @param widget The schema part representing the current widget
 * @param verna The verna context, used to update the rendered schema and the translations
 * @param value The string value set to this key
 * @param translationKey the corresponding key used in the translation object
 * @param locale The current locale loaded
 */
function updateStringTranslation(
  propertyKey: keyof VernaJSONSchemaType,
  widget: VernaJSONSchemaType,
  verna: VernaContextProps,
  value: string,
  translationKey: string,
  locale: string,
) {
  const newWidget = _.cloneDeep(widget);
  // @ts-ignore
  newWidget[propertyKey] = translationKey;
  const newTranslation = {
    [locale]: {
      [translationKey]: value,
    },
  };
  verna.addVernaTranslations(newTranslation);
  return newWidget;
}

/**
 * Update the schema to update a widget property
 *
 * @param propertyKey The key of the property to modify
 * @param value The value to set to this key
 * @param verna The verna context, used to update the rendered schema
 * @param widgetPath The decomposed id for the corresponding widget
 * @param locale The current locale loaded
 * @param section The section containing the widget to update
 */
function updateProperty(
  propertyKey: keyof VernaJSONSchemaType,
  value: unknown,
  verna: VernaContextProps,
  widgetPath: string[],
  locale: string,
  section: VernaJSONSchemaType,
) {
  const widgetName = widgetPath[widgetPath.length - 1];
  let widget = section.properties?.[widgetName];

  if (!widget)
    throw new Error(
      "Error, can't get the widget to update its properties in updateProperty function",
    );

  const translationKey = getTranslationKey(widgetPath, propertyKey, verna.selector);
  if (typeof value === 'string' && locale) {
    widget = updateStringTranslation(propertyKey, widget, verna, value, translationKey, locale);
  } else if (Array.isArray(value) && locale) {
    widget = updateEnumTranslations(propertyKey, widget, verna, value, translationKey, locale);
    verna.updateWidget(widget, widgetPath.join(RJSF_ID_SEPARATOR));
  } else {
    widget[propertyKey] = value;
  }
  return { ...section, properties: { ...section.properties, [widgetName]: widget } };
}

/**
 * Add or remove a widget from required fields inside its section
 *
 * @param value The value to add or removed from required property
 * @param verna The verna context, used to update the rendered schema
 * @param section The section containing the widget to update
 * @param widgetPath The decomposed id for the corresponding widget
 * @param locale The current locale loaded, added only to have the same prototype as other functions
 */
function updateRequired(
  verna: VernaContextProps,
  value: Properties['required'],
  section: VernaJSONSchemaType,
  widgetPath: string[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale: string,
) {
  const widgetName = widgetPath[widgetPath.length - 1];
  if (value) {
    if (!section.required?.includes(widgetName)) {
      section.required = [...(section.required || []), widgetName];
    }
  } else {
    section.required = section.required?.filter((e: string) => e !== widgetName);
  }
  return section;
}

export { updateRequired, updateProperty };
