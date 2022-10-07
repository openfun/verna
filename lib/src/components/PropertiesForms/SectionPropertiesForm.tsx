import Form, { type ISubmitEvent, type UiSchema } from '@rjsf/core';
import { FormEvent, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useVerna } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { sectionParametersSchema } from ':/templates';
import VernaJSONSchemaType from ':/types/rjsf';
import { Maybe } from ':/types/utils';
import { getSectionName } from ':/utils';
import { SectionParameters, updateSectionProperties } from ':/utils/schema/updateSectionProperties';
import { DEFAULT_PROPERTY_TRANSLATION } from ':/utils/translation';

interface SectionPropertiesFormProps {
  onClose: () => void;
  id: string;
}

const messages = defineMessages({
  submitWidgetParameter: {
    defaultMessage: 'Save',
    description: 'Label of submit input',
    id: 'components.SectionPropertiesForm.submitWidgetParameter',
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

    const isMessageKey = (key: PropertyKey): key is keyof typeof messages => {
      return key in messages;
    };

    // Translate parameters names
    for (const key of Object.keys(parameterSchema?.properties || {})) {
      if (isMessageKey(key) && parameterSchema?.properties) {
        parameterSchema.properties[key].title = formatMessage({
          defaultMessage:
            (locale && verna.schema.translationSchema?.[locale]?.[key]) ||
            messages[key].defaultMessage,
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
    let currentSection: Maybe<VernaJSONSchemaType>;
    if (verna.selector) {
      currentSection = verna.schema.formSchema?.properties?.[verna.selector];
    } else {
      const sectionName = getSectionName(id, true);
      currentSection = sectionName
        ? verna.schema.formSchema?.properties?.[sectionName]
        : verna.schema.formSchema;
    }

    return {
      description:
        currentSection?.description &&
        formatMessage({
          defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
          id: currentSection.description,
        }),
      title:
        currentSection?.title &&
        formatMessage({
          defaultMessage: DEFAULT_PROPERTY_TRANSLATION,
          id: currentSection.title,
        }),
    };
  }

  const propertiesSchema = useMemo(() => translateSchema(), [locale]);

  return (
    <Form
      FieldTemplate={verna.FieldTemplate}
      className="section-properties-form"
      formData={getDefaultValues()}
      idSeparator={RJSF_ID_SEPARATOR}
      onSubmit={handleSubmit}
      schema={propertiesSchema}
      showErrorList={false}
      uiSchema={uiSchema}
      widgets={verna.widgets}
    >
      {verna.SubmitButton}
    </Form>
  );
}
