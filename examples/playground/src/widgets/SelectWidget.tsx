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
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange && props.onChange(event.target.value)}
      >
        {(props.options?.enumOptions as option[] | undefined)?.map((option, index) => (
          <option key={`${option.label}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
