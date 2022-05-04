import Field, { FieldProps } from './Field';
import { InputHTMLAttributes } from 'react';

interface TextTemplateWidgetProps extends InputHTMLAttributes<HTMLInputElement>, FieldProps {
  id: string;
  label?: string;
  type?:
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
      <input
        aria-label={label}
        className="form-field__input"
        id={id}
        placeholder={label}
        type={type}
        {...props}
      />
      {label && (
        <label className="form-field__label" htmlFor={id}>
          {label}
        </label>
      )}
    </Field>
  );
}
