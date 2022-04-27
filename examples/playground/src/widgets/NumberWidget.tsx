import type { WidgetProps } from '@rjsf/core';

export default function TextWidget(props: Partial<WidgetProps>) {
  return (
    <label>
      {props.label}
      {props.required && '*'}
      <input
        onChange={(event) => props.onChange && props.onChange(event.target.value)}
        required={props.required}
        type="number"
        value={props.value}
      />
    </label>
  );
}
