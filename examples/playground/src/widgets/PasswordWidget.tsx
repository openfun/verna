import type { WidgetProps } from '@rjsf/core';

export default function PasswordWidget(props: Partial<WidgetProps>) {
  return (
    <div>
      <label>{props.label}</label>
      <input
        onChange={(event) => props.onChange && props.onChange(event.target.value)}
        required={props.required}
        type="password"
        value={props.value}
      />
    </div>
  );
}
