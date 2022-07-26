import type { VernaWidgetProps } from '@openfun/verna';
import { Box, CheckBoxGroup, FormField } from 'grommet';

export default function CheckboxesWidget({
  value,
  label,
  onChange,
  options,
  rawErrors,
  disabled,
}: VernaWidgetProps) {
  const { enumOptions, enumDisabled } = options;

  return (
    <Box pad={{ right: 'xsmall', vertical: 'xsmall' }}>
      <FormField contentProps={{ style: { border: 'none' } }} label={label} message={rawErrors}>
        <CheckBoxGroup
          disabled={!!enumDisabled || disabled}
          onChange={(e) => onChange(e?.value)}
          options={enumOptions === null || !Array.isArray(enumOptions) ? [] : enumOptions}
          value={value}
        />
      </FormField>
    </Box>
  );
}
