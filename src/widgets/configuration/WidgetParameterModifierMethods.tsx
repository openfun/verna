import { JSONSchema7 } from 'json-schema';
import { VernaContextProps } from '../../context/VernaContextProvider';
import type { Parameters } from './WidgetParametersModifier';

function updateValueOfProperties(
  key: keyof JSONSchema7,
  value: unknown,
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
          // @ts-ignore
          widget[key] = value as number;
        }
      }
    }
  }
  verna.setSchema(newSchema);
}

function updateRequiredValidator(
  value: Parameters['required'],
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
        if (value) {
          section.required = [...(section.required || []), widgetIdParts[1]];
        } else {
          section.required = section.required?.filter((e) => e !== widgetIdParts[1]);
        }
      }
    }
  }
  verna.setSchema(newSchema);
}

function updateItemsValidator(
  value: Parameters['items'],
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
        if (widget && typeof widget !== 'boolean' && widget.items) {
          (widget.items as JSONSchema7).enum = value as string[];
        }
      }
    }
  }
  verna.setSchema(newSchema);
}

function updateMaxLengthValidator(
  value: Parameters['maxLength'],
  verna: VernaContextProps,
  widgetIdParts: string[],
) {
  updateValueOfProperties('maxLength', value, verna, widgetIdParts);
}

function updateEnumValidator(
  value: Parameters['items'],
  verna: VernaContextProps,
  widgetIdParts: string[],
) {
  updateValueOfProperties('enum', value, verna, widgetIdParts);
}

function updateMaximumValidator(
  value: Parameters['maximum'],
  verna: VernaContextProps,
  widgetIdParts: string[],
) {
  updateValueOfProperties('maximum', value, verna, widgetIdParts);
}

function updateMinimumValidator(
  value: Parameters['maximum'],
  verna: VernaContextProps,
  widgetIdParts: string[],
) {
  updateValueOfProperties('minimum', value, verna, widgetIdParts);
}

export {
  updateItemsValidator,
  updateRequiredValidator,
  updateValueOfProperties,
  updateEnumValidator,
  updateMaximumValidator,
  updateMinimumValidator,
  updateMaxLengthValidator,
};
