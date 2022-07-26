import { FormField, TextInput } from 'grommet';
import { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import Field, { FieldProps } from './Field';

interface TextTemplateWidgetProps extends InputHTMLAttributes<unknown>, FieldProps {
  label?: string;
  type?:
    | 'checkbox'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'text'
    | 'url'
    | 'week';
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

const placeholderMessage = defineMessages({
  placeholder: {
    defaultMessage: 'Type here...',
    description: 'placeholder displayed in every empty fields',
    id: 'widgets.templates.TextTemplateWidget.placeholder',
  },
});

export function TextTemplateWidget(props: TextTemplateWidgetProps) {
  const { formatMessage } = useIntl();
  const {
    fieldClasses = [],
    label,
    error,
    message,
    onChange,
    value,
    required,
    disabled,
    type,
  } = props;
  return (
    <Field error={error} fieldClasses={fieldClasses}>
      <FormField
        disabled={disabled}
        error={message}
        label={label}
        required={required}
        value={value}
      >
        <TextInput
          a11yTitle={label}
          defaultValue={value}
          disabled={disabled}
          onChange={onChange}
          placeholder={formatMessage(placeholderMessage.placeholder)}
          required={required}
          title={label}
          type={type}
        />
      </FormField>
    </Field>
  );
}

export { placeholderMessage };
