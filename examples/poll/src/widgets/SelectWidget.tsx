import type { VernaWidgetProps } from '@openfun/verna';
import { FormField, Select } from 'grommet';
import { defineMessages, useIntl } from 'react-intl';
import Field from './templates/Field';

interface option {
  label: string;
  value: string;
}

const placeholderMessage = defineMessages({
  placeholderSelect: {
    defaultMessage: 'Select option',
    description: 'placeholder displayed in empty select field',
    id: 'widgets.templates.TextTemplateWidget.placeholderSelect',
  },
});

export default function SelectWidget({
  disabled,
  id,
  label,
  error,
  message,
  options,
  onChange,
  required,
  value,
}: VernaWidgetProps) {
  const { formatMessage } = useIntl();
  const values = ((options.enumOptions || []) as option[]).map((option) => option.value);

  return (
    <Field error={error} message={message}>
      <FormField disabled={disabled} label={label} required={required}>
        <Select
          aria-label={label}
          disabled={disabled}
          id={id}
          onChange={(event) => onChange(event.target.value)}
          options={values}
          placeholder={formatMessage(placeholderMessage.placeholderSelect)}
          required={required}
          value={value}
        />
      </FormField>
    </Field>
  );
}
