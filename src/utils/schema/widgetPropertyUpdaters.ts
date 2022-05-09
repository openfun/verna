import { VernaContextProps } from '../../providers/VernaProvider';
import VernaJSONSchemaType from '../../types/rjsf';
import type { Properties } from './updateWidgetProperties';

/**
 * This function modify a property on the level of the widget directly inside the Schema
 *
 * @param propertyKey The key of the property to modify
 * @param value The value to set to this key
 * @param verna The verna context, used to update the rendered schema
 * @param widgetPath The decomposed id for the corresponding widget
 */
function updateProperty(
  propertyKey: keyof VernaJSONSchemaType,
  value: unknown,
  verna: VernaContextProps,
  widgetPath: string[],
) {
  const newSchema = { ...verna.schema };
  if (verna.selector) {
    // TODO
  } else {
    const section = newSchema.properties?.[widgetPath[0]];
    const widget = section?.properties?.[widgetPath[1]];
    if (widget) {
      // @ts-ignore
      widget[propertyKey] = value as number;
    }
  }
  verna.setSchema(newSchema);
}

/**
 * Add or remove a widget from required fields inside its section
 *
 * @param value The value to add or removed from required property
 * @param verna The verna context, used to update the rendered schema
 * @param widgetPath The decomposed id for the corresponding widget
 */
function updateRequired(
  value: Properties['required'],
  verna: VernaContextProps,
  widgetPath: string[],
) {
  const newSchema = { ...verna.schema };
  if (verna.selector) {
    // TODO
  } else {
    const section = newSchema.properties?.[widgetPath[0]];
    if (section) {
      if (value) {
        section.required = [...(section.required || []), widgetPath[1]];
      } else {
        section.required = section.required?.filter((e: string) => e !== widgetPath[1]);
      }
    }
  }
  verna.setSchema(newSchema);
}

/**
 * Add or remove items from a widget.
 * The items array is the list of props displayed in the widget
 * (e.g: a Select field)
 *
 * @param value The value to add or removed from required property
 * @param verna The verna context, used to update the rendered schema
 * @param widgetPath The decomposed id for the corresponding widget
 */
function updateItems(value: Properties['items'], verna: VernaContextProps, widgetPath: string[]) {
  const newSchema = verna.schema;
  if (verna.selector) {
    // TODO
  } else {
    const section = newSchema.properties?.[widgetPath[0]];
    if (section) {
      const widget = section.properties?.[widgetPath[1]];
      if (widget && widget.items) {
        (widget.items as VernaJSONSchemaType).enum = value as string[];
      }
    }
  }
  verna.setSchema(newSchema);
}

function updateMaxLength(
  value: Properties['maxLength'],
  verna: VernaContextProps,
  widgetPath: string[],
) {
  updateProperty('maxLength', value, verna, widgetPath);
}

function updateEnum(value: Properties['items'], verna: VernaContextProps, widgetPath: string[]) {
  updateProperty('enum', value, verna, widgetPath);
}

function updateMaximum(
  value: Properties['maximum'],
  verna: VernaContextProps,
  widgetPath: string[],
) {
  updateProperty('maximum', value, verna, widgetPath);
}

function updateMinimum(
  value: Properties['maximum'],
  verna: VernaContextProps,
  widgetPath: string[],
) {
  updateProperty('minimum', value, verna, widgetPath);
}

export {
  updateItems,
  updateRequired,
  updateProperty,
  updateEnum,
  updateMaximum,
  updateMinimum,
  updateMaxLength,
};
