import { IntlFormatters } from '@formatjs/intl/src/types';
import _ from 'lodash';
import VernaJSONSchemaType from ':/types/rjsf';
import { Maybe } from ':/types/utils';

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
  const widgets = translatedSchema.properties;
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
  const sections = translatedSchema.properties;
  if (!sections) return;

  Object.keys(sections).forEach((sectionKey) => {
    const section = sections[sectionKey];
    translateSection(section, formatMessage);
    translateSectionWidgets(section, formatMessage);
  });
}

/**
 * Translate the whole schema before rendering
 *
 * @param schema original schema with translation keys
 * @param formatMessage Intl function to translate a key
 * @param selector is the name of the selected section if there is one
 */
export function translateSchema(
  schema: VernaJSONSchemaType,
  formatMessage: IntlFormatters['formatMessage'],
  selector: Maybe<string>,
) {
  const translatedSchema = _.cloneDeep(schema);
  translateSection(translatedSchema, formatMessage);

  if (selector) {
    translateSectionWidgets(translatedSchema, formatMessage);
  } else {
    translateSchemaWithoutSelector(translatedSchema, formatMessage);
  }
  return translatedSchema;
}
