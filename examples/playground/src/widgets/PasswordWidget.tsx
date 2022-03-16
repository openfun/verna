import type { WidgetProps } from '@rjsf/core';

export default function PasswordWidget(props: Partial<WidgetProps>) {
  return (
    <div>
      <label>{props.label}</label>
      <input
        type="password"
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange && props.onChange(event.target.value)}
      />
    </div>
  );
}
