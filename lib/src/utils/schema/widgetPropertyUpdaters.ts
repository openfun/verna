import { VernaContextProps } from ':/providers/VernaProvider';
import VernaJSONSchemaType from ':/types/rjsf';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { Maybe } from ':/types/utils';
import type { Properties } from './updateWidgetProperties';

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

/**
 * Destroy old translation values of the propertyKey element
 *
 * @param propertyKey The key of the property which translations have to be removed
 * @param verna Verna context
 * @param translationKey the key of translation used for this element
 * @param locale Current locale
 */
function removePropertyTranslations(
  propertyKey: keyof VernaJSONSchemaType,
  verna: VernaContextProps,
  translationKey: string,
  locale: string,
) {
  translationKey.replace(`_${propertyKey}`, '');
  const oldKeys = Object.keys(verna.schemaTranslations[locale]).filter((key) =>
    key.includes(translationKey),
  );
  oldKeys.forEach((key) => {
    delete verna.schemaTranslations[locale][key];
  });
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
  removePropertyTranslations(propertyKey, verna, translationKey, locale);

  // Create translation values
  let newTranslationKeys: string[] = [];
  values.forEach((e, index) => {
    const key = translationKey.concat(`_${index.toString()}`);
    newTranslationKeys.push(key);
    if (locale) {
      verna.schemaTranslations[locale][key] = e;
    }
  });
  verna.setSchemaTranslations({
    ...verna.schemaTranslations,
  });
  if (propertyKey === 'enum') {
    widget.enum = newTranslationKeys;
  } else if (propertyKey === 'items') {
    updateItemsTranslations(widget, newTranslationKeys);
  }
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
  if (!widget[propertyKey]) {
    // @ts-ignore
    widget[propertyKey] = translationKey;
  }
  verna.schemaTranslations[locale][translationKey] = value;
  verna.setSchemaTranslations({
    ...verna.schemaTranslations,
  });
}

/**
 * Update the schema to update a widget property
 *
 * @param propertyKey The key of the property to modify
 * @param value The value to set to this key
 * @param verna The verna context, used to update the rendered schema
 * @param widgetPath The decomposed id for the corresponding widget
 * @param locale The current locale loaded
 * @param newSchema New Schema that will update render once set
 */
function updateProperty(
  propertyKey: keyof VernaJSONSchemaType,
  value: unknown,
  verna: VernaContextProps,
  widgetPath: string[],
  locale: string,
  newSchema: VernaJSONSchemaType,
) {
  let widget: VernaJSONSchemaType | undefined;

  if (verna.selector) {
    widget = newSchema.properties?.[widgetPath[1]];
  } else {
    const section = newSchema.properties?.[widgetPath[1]];
    widget = section?.properties?.[widgetPath[2]];
  }

  if (widget) {
    const translationKey = getTranslationKey(widgetPath, propertyKey, verna.selector);
    if (typeof value === 'string' && locale) {
      updateStringTranslation(propertyKey, widget, verna, value, translationKey, locale);
    } else if (Array.isArray(value) && locale) {
      updateEnumTranslations(propertyKey, widget, verna, value, translationKey, locale);
    } else {
      // @ts-ignore
      widget[propertyKey] = value;
    }
  }
}

/**
 * Add or remove a widget from required fields inside its section
 *
 * @param value The value to add or removed from required property
 * @param verna The verna context, used to update the rendered schema
 * @param widgetPath The decomposed id for the corresponding widget
 * @param locale The current locale loaded
 * @param newSchema New Schema that will update render once set
 */
function updateRequired(
  value: Properties['required'],
  verna: VernaContextProps,
  widgetPath: string[],
  locale: string,
  newSchema: VernaJSONSchemaType,
) {
  let section;
  let widgetName: string;

  if (verna.selector) {
    section = newSchema;
    widgetName = widgetPath[1];
  } else {
    section = newSchema.properties?.[widgetPath[1]];
    widgetName = widgetPath[2];
  }
  if (section) {
    if (value) {
      if (!section.required?.includes(widgetName)) {
        section.required = [...(section.required || []), widgetName];
      }
    } else {
      section.required = section.required?.filter((e: string) => e !== widgetName);
    }
  }
}

export { updateRequired, updateProperty };
