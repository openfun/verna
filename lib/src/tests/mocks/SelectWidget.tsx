import type { WidgetProps } from '@rjsf/core';

interface option {
  label: string;
  value: string;
}

export default function SelectWidget(props: Partial<WidgetProps>) {
  return (
    <label>
      {props.label}
      {props.required && '*'}
      <select
        disabled={props.disabled}
        id={props.id}
        onChange={(event) => props.onChange && props.onChange(event.target.value)}
        required={props.required}
        value={props.value}
      >
        {((props.options?.enumOptions || []) as option[])?.map((option, index) => (
          <option key={`${option.label}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
