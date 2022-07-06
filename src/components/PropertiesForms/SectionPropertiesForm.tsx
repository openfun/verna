import Form, { type ISubmitEvent, type UiSchema } from '@rjsf/core';
import { defineMessages, useIntl } from 'react-intl';
import { FormEvent, useMemo } from 'react';
import { useVerna } from '../../providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from '../../settings';
import { DEFAULT_PROPERTY_TRANSLATION } from '../../utils/translation';
import { sectionParametersSchema } from '../../templates';
import {
  SectionParameters,
  updateSectionProperties,
} from '../../utils/schema/updateSectionProperties';

interface SectionPropertiesFormProps {
  onClose: () => void;
  id: string;
}

const messages = defineMessages({
  description: {
    defaultMessage: 'Description',
    description: 'Description of the section',
    id: 'components.SectionPropertiesForm.description',
  },
  legend: {
    defaultMessage: 'Options',
    description: 'Legend of the section',
    id: 'components.SectionPropertiesForm.legend',
  },
  submitWidgetParameter: {
    defaultMessage: 'Save',
    description: 'Label of submit input',
    id: 'components.SectionPropertiesForm.submitWidgetParameter',
  },
  title: {
    defaultMessage: 'Title',
    description: 'Title of the section',
    id: 'components.SectionPropertiesForm.title',
  },
});

/**
 * This component is used as an edit interface to parameter the linked section
 * It will render a form by using the RJSF format and on validation
 * it will apply the changes on the section
 */
export default function SectionPropertiesForm({ id, onClose }: SectionPropertiesFormProps) {
  const verna = useVerna();
  const { locale, formatMessage } = useIntl();

  function handleSubmit(
    event: ISubmitEvent<SectionParameters>,
    nativeEvent: FormEvent<HTMLFormElement>,
  ) {
    nativeEvent.preventDefault();
    updateSectionProperties(event.formData, verna, id, locale);
    onClose();
    return false;
  }

  function translateSchema() {
    const parameterSchema = sectionParametersSchema();

    parameterSchema.title = formatMessage(messages.legend);
    parameterSchema.description = formatMessage(messages.description);

    const isMessageKey = (key: PropertyKey): key is keyof typeof messages => {
      return key in messages;
    };

    // Translate parameters names
    for (const key of Object.keys(parameterSchema?.properties || {})) {
      if (isMessageKey(key) && parameterSchema?.properties) {
        parameterSchema.properties[key].title = formatMessage({
          defaultMessage:
            (locale && verna.schemaTranslations[locale][key]) || messages[key].defaultMessage,
          id: messages[key].id,
        });
      }
    }
    return parameterSchema || {};
  }

  const uiSchema: UiSchema = {
    'ui:order': ['title', 'description'],
    'ui:submitButtonOptions': {
      norender: false,
      props: {
        className: 'btn btn-save-parameters',
      },
      submitText: formatMessage(messages.submitWidgetParameter),
    },
  };

  function getDefaultValues(): SectionParameters {
    const sectionName = verna.selector ? verna.selector : id.split(RJSF_ID_SEPARATOR)[1];
    const currentSection =
      id === 'root' ? verna.schema : verna.schema.properties?.[sectionName] || {};

    return {
      description:
        currentSection.description &&
        formatMessage({
          defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
          id: currentSection.description,
        }),
      title:
        currentSection.title &&
        formatMessage({
          defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
          id: currentSection.title,
        }),
    };
  }

  const propertiesSchema = useMemo(() => translateSchema(), [locale]);

  return (
    <Form
      className="section-properties-form"
      formData={getDefaultValues()}
      idSeparator={RJSF_ID_SEPARATOR}
      onSubmit={handleSubmit}
      schema={propertiesSchema}
      showErrorList={false}
      uiSchema={uiSchema}
    />
  );
}
