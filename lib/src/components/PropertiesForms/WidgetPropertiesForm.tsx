import Form, { type ISubmitEvent, type UiSchema } from '@rjsf/core';
import { defineMessages, useIntl } from 'react-intl';
import { FormEvent, useMemo } from 'react';
import _ from 'lodash';
import { useVerna } from ':/providers/VernaProvider';
import { getUiWidgetName } from ':/utils';
import { RJSF_ID_SEPARATOR } from ':/settings';
import type VernaJSONSchemaType from ':/types/rjsf';
import { Properties, updateWidgetProperties } from ':/utils/schema';
import { DEFAULT_PROPERTY_TRANSLATION } from ':/utils/translation';
import { Maybe } from ':/types/utils';
import { defaultWidgetProps } from ':/templates';

interface WidgetPropertiesFormProps {
  onClose: () => void;
  id: string;
}

const messages = defineMessages({
  description: {
    defaultMessage: 'description',
    description: 'Description of the field',
    id: 'components.WidgetPropertiesForm.description',
  },
  enum: {
    defaultMessage: 'Options',
    description: 'Fieldset label to add/remove options of a widget using an array of strings',
    id: 'components.WidgetPropertiesForm.enum',
  },
  items: {
    defaultMessage: 'Options',
    description: 'Fieldset label containing customizable options to add widgets as items',
    id: 'components.WidgetPropertiesForm.items',
  },
  maxLength: {
    defaultMessage: 'maximum length',
    description: 'Label of the maximum length input',
    id: 'components.WidgetPropertiesForm.maxLength',
  },
  maximum: {
    defaultMessage: 'maximum',
    description: 'Label of the maximum input',
    id: 'components.WidgetPropertiesForm.maximum',
  },
  minLength: {
    defaultMessage: 'minimum length',
    description: 'Label of the minimum length input',
    id: 'components.WidgetPropertiesForm.minLength',
  },
  minimum: {
    defaultMessage: 'minimum',
    description: 'Label of the minimum input',
    id: 'components.WidgetPropertiesForm.minimum',
  },
  required: {
    defaultMessage: 'required',
    description: 'Label of the required input',
    id: 'components.WidgetPropertiesForm.required',
  },
  submitWidgetParameter: {
    defaultMessage: 'save',
    description: 'Label of submit input',
    id: 'components.WidgetPropertiesForm.submitWidgetParameter',
  },
  title: {
    defaultMessage: 'title',
    description: 'Title of the field',
    id: 'components.WidgetPropertiesForm.title',
  },
});

/**
 * This component is used as an edit interface to parameter the linked widget
 * It will render a form by using the RJSF format and on validation
 * it will apply the changes on the widget
 */
export default function WidgetPropertiesForm({ id, onClose }: WidgetPropertiesFormProps) {
  const verna = useVerna();
  const { locale, formatMessage } = useIntl();
  const templateName = getUiWidgetName(id, verna.uiSchema);

  function handleSubmit(event: ISubmitEvent<unknown>, nativeEvent: FormEvent<HTMLFormElement>) {
    nativeEvent.preventDefault();
    updateWidgetProperties(
      event.formData as Properties,
      verna,
      id,
      Object.keys({
        ...verna.configSchema?.properties?.[templateName]?.properties,
        ...defaultWidgetProps,
      }),
      locale,
    );
    onClose();
    return false;
  }

  function translateSchema() {
    // Get the schema corresponding to the configuration of this widget and clone it
    const widgetSchema = {
      properties: {
        ..._.cloneDeep(verna.configSchema?.properties?.[templateName]?.properties || {}),
        ...defaultWidgetProps,
      },
    };

    const isMessageKey = (key: PropertyKey): key is keyof typeof messages => {
      return key in messages;
    };

    // Translate parameters names
    for (const key of Object.keys(widgetSchema?.properties || {})) {
      if (isMessageKey(key) && widgetSchema?.properties) {
        widgetSchema.properties[key].title = formatMessage({
          defaultMessage:
            (locale && verna.schemaTranslations[locale]?.[key]) || messages[key].defaultMessage,
          id: messages[key].id,
        });
      }
    }
    return widgetSchema || verna.configSchema || {};
  }

  function translateEnum(enumValues: string[]) {
    return enumValues.map((value) =>
      formatMessage({ defaultMessage: DEFAULT_PROPERTY_TRANSLATION, id: value as string }),
    );
  }

  /**
   * Translate items of a widget
   * It manages either an array of objects or a unique one
   * If it's an array, every object will be translated
   *
   * @param items one or many with enum values
   */
  function translateItems(items: Maybe<VernaJSONSchemaType | VernaJSONSchemaType[]>) {
    if (Array.isArray(items)) {
      return items.map((item) => ({
        description: formatMessage({
          defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
          id: item.description,
        }),
        enum: translateEnum(item.enum || []),
        title: formatMessage({
          defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
          id: item.title,
        }),
      }));
    } else if (items?.enum) {
      return translateEnum(items.enum);
    }

    return undefined;
  }

  const uiSchema: UiSchema = {
    'ui:order': ['title', 'description'].concat(
      Object.keys(verna.configSchema?.properties?.[templateName]?.properties || {}),
    ),
    'ui:submitButtonOptions': {
      norender: false,
      props: {
        className: 'btn btn-save-parameters',
      },
      submitText: formatMessage(messages.submitWidgetParameter),
    },
  };

  function getDefaultValues() {
    const path = id.split(RJSF_ID_SEPARATOR);
    const widgetName = path[verna.selector ? 1 : 2];
    const currentSection: VernaJSONSchemaType =
      (verna.selector ? verna.schema : verna.schema.properties?.[path[1]]) || {};
    const self = currentSection?.properties?.[widgetName] || {};

    return {
      description:
        self.description &&
        formatMessage({
          defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
          id: self.description,
        }),
      enum: translateEnum(self.enum || []),
      items: translateItems(self.items),
      maxLength: self.maxLength,
      maximum: self.maximum,
      minLength: self.minLength,
      minimum: self.minimum,
      required:
        currentSection.required && (currentSection.required as string[]).includes(widgetName),
      title:
        self.title &&
        formatMessage({
          defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
          id: self.title,
        }),
    };
  }

  const propertiesSchema = useMemo(() => translateSchema(), [locale]);

  return (
    <Form
      className="widget-properties-form"
      formData={getDefaultValues()}
      idSeparator={RJSF_ID_SEPARATOR}
      onSubmit={handleSubmit}
      schema={propertiesSchema}
      showErrorList={false}
      uiSchema={uiSchema}
    />
  );
}
