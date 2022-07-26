import { Box } from 'grommet';
import { PropsWithChildren, useMemo } from 'react';

export interface FieldProps {
  error?: Boolean;
  message?: string;
  fieldClasses?: string[];
}

export default function Field({
  fieldClasses = [],
  error,
  children,
}: PropsWithChildren<FieldProps>) {
  const classList = useMemo(() => {
    const classes = ['form-field', ...fieldClasses];
    if (error) {
      classes.push('form-field-error');
    }
    return classes.join(' ');
  }, [fieldClasses, error]);

  return (
    <Box
      className={classList}
      pad={{ right: 'xsmall', vertical: 'xsmall' }}
      style={{ flexGrow: '1' }}
    >
      {children}
    </Box>
  );
}
