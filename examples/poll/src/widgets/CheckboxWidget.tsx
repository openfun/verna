import type { VernaWidgetProps } from '@openfun/verna';
import { Box, CheckBox, FormField, Text } from 'grommet';
import React from 'react';

export default function CheckboxWidget({
  disabled,
  rawErrors,
  label,
  onChange,
  value,
}: VernaWidgetProps) {
  const [checked, setChecked] = React.useState(value);

  return (
    <Box pad={{ right: 'xsmall', vertical: 'xsmall' }}>
      <FormField
        contentProps={{ style: { border: 'none' } }}
        message={rawErrors}
        value={checked ? 'true' : 'false'}
      >
        <Box align="center" direction="row" gap="15px">
          <CheckBox
            checked={checked}
            defaultChecked={checked}
            disabled={disabled}
            value={checked ? 'true' : 'false'}
            onChange={() => {
              onChange(!checked);
              setChecked(!checked);
            }}
          />
          <Text>{label}</Text>
        </Box>
      </FormField>
    </Box>
  );
}
