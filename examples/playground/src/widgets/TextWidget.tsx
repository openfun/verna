import type { VernaWidgetProps } from '@openfun/verna/dist/types/Widgets';
import { TextTemplateWidget } from './templates/TextTemplateWidget';

export default function TextWidget({
  disabled,
  rawErrors,
  onChange,
  id,
  label,
  required,
  value,
}: VernaWidgetProps) {
  return (
    <>
      <TextTemplateWidget
        disabled={disabled}
        error={!!rawErrors}
        fieldClasses={['testclass']}
        id={id}
        label={label}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type="text"
        value={value}
      />
      {rawErrors}
    </>
  );
}
