import type { WidgetProps } from '@rjsf/core';

export default function TextWidget(props: Partial<WidgetProps>) {
  return (
    <label>
      {props.label}
      <input
        type="text"
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange && props.onChange(event.target.value)}
      />
    </label>
  );
}
