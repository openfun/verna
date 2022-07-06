import type { VernaWidgetProps } from '@openfun/verna/dist/types/Widgets';
import Field from './templates/Field';

export default function TextareaWidget({
  id,
  label,
  error,
  message,
  disabled,
  required,
  onChange,
  value,
}: VernaWidgetProps) {
  return (
    <Field error={error} message={message}>
      <textarea
        aria-label={label}
        className="form-field__textarea"
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        value={value}
      />
      {label && (
        <label className="form-field__label" htmlFor={id}>
          {label}
        </label>
      )}
    </Field>
  );
}
