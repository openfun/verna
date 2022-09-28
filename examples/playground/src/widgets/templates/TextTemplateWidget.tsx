import { ChangeEventHandler, InputHTMLAttributes } from 'react';
import Field, { FieldProps } from './Field';

interface TextTemplateWidgetProps extends InputHTMLAttributes<unknown>, FieldProps {
  label: string;
  type:
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
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export function TextTemplateWidget({
  fieldClasses = [],
  label,
  id,
  type,
  error,
  message,
  ...props
}: TextTemplateWidgetProps) {
  return (
    <Field error={error} fieldClasses={fieldClasses} message={message}>
      {label && (
        <label className="form-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        aria-label={label}
        className="form-field__input"
        id={id}
        placeholder={label}
        type={type}
        {...props}
      />
    </Field>
  );
}
