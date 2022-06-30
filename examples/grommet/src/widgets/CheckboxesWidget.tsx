import { VernaWidgetProps } from '../../../../src/types/Widgets';
import { Box, CheckBoxGroup } from 'grommet';

export default function CheckboxesWidget({
  value,
  label,
  onChange,
  options,
  disabled,
}: VernaWidgetProps) {
  const { enumOptions, enumDisabled } = options;

  return (
    <Box pad="medium">
      <label className="form-field__label">{label}</label>
      <CheckBoxGroup
        disabled={!!enumDisabled || disabled}
        onChange={(e) => onChange(e?.value)}
        options={enumOptions === null || !Array.isArray(enumOptions) ? [] : enumOptions}
        value={value}
      />
    </Box>
  );
}
