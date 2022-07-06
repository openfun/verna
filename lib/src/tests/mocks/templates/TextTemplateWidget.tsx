import Field, { FieldProps } from './Field';
import { ChangeEventHandler, InputHTMLAttributes } from 'react';

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
