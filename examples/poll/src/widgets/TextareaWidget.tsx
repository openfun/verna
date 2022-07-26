import type { VernaWidgetProps } from '@openfun/verna';
import { FormField, TextArea } from 'grommet';
import { useIntl } from 'react-intl';
import Field from './templates/Field';
import { placeholderMessage } from ':/widgets/templates/TextTemplateWidget';

export default function TextareaWidget({
  id,
  label,
  error,
  message,
  disabled,
  required,
  onChange,
  value,
}: VernaWidgetProps) {
  const { formatMessage } = useIntl();

  return (
    <Field error={error} message={message}>
      <FormField disabled={disabled} error={error} label={label}>
        <TextArea
          aria-label={label}
          className="form-field__textarea"
          disabled={disabled}
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={formatMessage(placeholderMessage.placeholder)}
          required={required}
          value={value}
        />
      </FormField>
    </Field>
  );
}
