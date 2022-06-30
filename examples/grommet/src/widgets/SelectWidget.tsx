import Field from './templates/Field';
import { VernaWidgetProps } from '../../../../src/types/Widgets';
import { Box, Select } from 'grommet';

interface option {
  label: string;
  value: string;
}

export default function SelectWidget({ id, label, error, message, ...props }: VernaWidgetProps) {
  const values = ((props.options.enumOptions || []) as option[]).map((option) => option.value);

  return (
    <Field error={error} message={message}>
      <Box direction="column">
        {label && (
          <label className="form-field__label" htmlFor={id}>
            {label}
          </label>
        )}
        <Select
          aria-label={label}
          disabled={props.disabled}
          id={id}
          onChange={(event) => props.onChange(event.target.value)}
          options={values}
          required={props.required}
          value={props.value}
        />
      </Box>
    </Field>
  );
}
