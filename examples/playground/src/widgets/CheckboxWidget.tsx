import type { VernaWidgetProps } from '@openfun/verna/dist/types/Widgets';
import { TextTemplateWidget } from './templates/TextTemplateWidget';

export default function CheckboxWidget({
  disabled,
  rawErrors,
  onChange,
  id,
  label,
  required,
  value,
}: VernaWidgetProps) {
  return (
    <TextTemplateWidget
      checked={value}
      disabled={disabled}
      error={!!rawErrors}
      id={id}
      label={label}
      required={required}
      type="checkbox"
      onChange={() => {
        onChange(!value);
      }}
    />
  );
}
