import { VernaWidgetProps } from '../../../../src/types/Widgets';
import { TextTemplateWidget } from './templates/TextTemplateWidget';
import { useState } from 'react';

export default function CheckboxWidget({
  disabled,
  rawErrors,
  onChange,
  id,
  label,
  required,
  value,
}: VernaWidgetProps) {
  const [checked, setChecked] = useState<boolean>(value || false);
  return (
    <>
      <TextTemplateWidget
        disabled={disabled}
        error={!!rawErrors}
        id={id || ''}
        label={label}
        onChange={() => setChecked(!checked) && onChange(checked)}
        required={required}
        type="checkbox"
      />
    </>
  );
}
