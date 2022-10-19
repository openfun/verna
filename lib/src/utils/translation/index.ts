import { IntlFormatters } from '@formatjs/intl/src/types';
import _ from 'lodash';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';

export const DEFAULT_PROPERTY_TRANSLATION = '';

export function translateWidget(
  widget: VernaJSONSchemaType,
  formatMessage: IntlFormatters['formatMessage'],
) {
  function translateItem(item: VernaJSONSchemaType) {
    return {
      description: item.description
        ? formatMessage({ defaultMessage: DEFAULT_PROPERTY_TRANSLATION, id: item.description })
        : undefined,
      enum: item.enum
        ? item.enum.map((id: string) => {
            return formatMessage({ defaultMessage: DEFAULT_PROPERTY_TRANSLATION, id: id });
          })
        : undefined,
      title: item.title
        ? formatMessage({ defaultMessage: DEFAULT_PROPERTY_TRANSLATION, id: item.title })
        : undefined,
    };
  }

  function translateItems(items: VernaJSONSchemaType | VernaJSONSchemaType[]) {
    if (Array.isArray(items)) return items.map(translateItem);
    return translateItem(items);
  }

  if (widget.enum) {
    widget.enum = widget.enum.map((name: string) =>
      formatMessage({ defaultMessage: DEFAULT_PROPERTY_TRANSLATION, id: name }),
    );
  }
  if (widget.items) {
    widget.items = translateItems(widget.items);
  }
  if (widget.title) {
    widget.title = formatMessage({
      defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
      id: widget.title,
    });
  }
  if (widget.description) {
    widget.description = formatMessage({
      defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
      id: widget.description,
    });
  }
}

function translateSection(
  section: VernaJSONSchemaType,
  formatMessage: IntlFormatters['formatMessage'],
) {
  if (section.title) {
    section.title = formatMessage({
      defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
      id: section.title,
    });
  }
  if (section.description) {
    section.description = formatMessage({
      defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
      id: section.description,
    });
  }
}

/**
 * Translate widgets of a whole section
 *
 * @param translatedSchema Ref to the part of schema that need to be translated
 * @param formatMessage Intl function to translate a key
 */
function translateSectionWidgets(
  translatedSchema: VernaJSONSchemaType,
  formatMessage: IntlFormatters['formatMessage'],
) {
  const widgets = translatedSchema?.properties;
  if (!widgets) return;

  Object.keys(widgets).forEach((widgetKey) => {
    const widget = widgets[widgetKey];
    translateWidget(widget, formatMessage);
  });
}

function translateSchemaWithoutSelector(
  translatedSchema: VernaJSONSchemaType,
  formatMessage: IntlFormatters['formatMessage'],
) {
  const properties = translatedSchema.properties;
  if (!properties) return;

  const propKeys = Object.keys(properties);

  if (propKeys.length > 0 && properties[propKeys[0]].type !== 'object') {
    translateSectionWidgets(translatedSchema, formatMessage);
  } else {
    propKeys.forEach((key) => {
      const property = properties[key];
      translateSection(property, formatMessage);
      translateSectionWidgets(property, formatMessage);
    });
  }
}

/**
 * Translate the whole schema before rendering
 *
 * @param schema original schema with translation keys
 * @param formatMessage Intl function to translate a key
 */
export function translateSchema(
  schema: VernaSchemaType,
  formatMessage: IntlFormatters['formatMessage'],
): VernaJSONSchemaType {
  const translatedSchema = _.cloneDeep(schema.formSchema) || {};
  translateSection(translatedSchema, formatMessage);
  translateSchemaWithoutSelector(translatedSchema, formatMessage);
  return translatedSchema;
}
