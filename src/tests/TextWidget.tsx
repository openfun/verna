import type { WidgetProps } from '@rjsf/core';

export default function TextWidget(props: Partial<WidgetProps>) {
  return (
    <>
      <label>{props.label}</label>
      <input
        type="text"
        className=""
        value={props.value}
        required={props.required}
        onChange={(event) => props?.onChange && props.onChange(event.target.value)}
      />
    </>
  );
}
