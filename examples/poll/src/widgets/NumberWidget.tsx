import type { VernaWidgetProps } from '@openfun/verna';
import { TextTemplateWidget } from './templates/TextTemplateWidget';

export default function NumberWidget(props: VernaWidgetProps) {
  return (
    <TextTemplateWidget
      disabled={props.disabled}
      error={!!props.rawErrors}
      id={props.id}
      label={props.label}
      message={props.rawErrors?.[0]}
      onChange={(event) => props.onChange(event.target.value)}
      required={props.required}
      type="number"
      value={props.value}
    />
  );
}
