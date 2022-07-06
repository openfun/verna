import type { VernaWidgetProps } from '@openfun/verna/dist/types/Widgets';
import Field from './templates/Field';

interface option {
  label: string;
  value: string;
}

export default function SelectWidget({ id, label, error, message, ...props }: VernaWidgetProps) {
  return (
    <Field error={error} message={message}>
      {label && (
        <label className="form-field__label" htmlFor={id}>
          {label}
        </label>
      )}
      <span className="form-field__select-container">
        <select
          aria-label={label}
          className="form-field__select-input"
          disabled={props.disabled}
          id={id}
          onChange={(event) => props.onChange(event.target.value)}
          required={props.required}
          value={props.value}
        >
          {((props.options?.enumOptions || []) as option[])?.map((option, index) => (
            <option key={`${option.label}-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="form-field__select-arrow" />
      </span>
    </Field>
  );
}
