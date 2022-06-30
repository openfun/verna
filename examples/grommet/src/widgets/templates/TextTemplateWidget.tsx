import Field, { FieldProps } from './Field';
import { ChangeEventHandler, InputHTMLAttributes } from 'react';
import { Text, TextInput } from 'grommet';

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

export function TextTemplateWidget(props: TextTemplateWidgetProps) {
  const {
    fieldClasses = [],
    label,
    id,
    error,
    message,
    value,
    onChange,
    placeholder,
    type,
    required,
    disabled,
  } = props;
  console.log(props);
  return (
    <Field error={error} fieldClasses={fieldClasses} message={message}>
      {label && (
        <label className="form-field__label" htmlFor={id}>
          {label}
          <Text color="darkred">{required && '*'}</Text>
        </label>
      )}
      <TextInput
        a11yTitle={label}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        // required={required}
        title={label}
        type={type}
        value={Array.isArray(value) ? value.join() : value}
      />
    </Field>
  );
}
