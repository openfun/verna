import { PropsWithChildren, useMemo } from 'react';
import { Box } from 'grommet';

export interface FieldProps {
  error?: Boolean;
  message?: string;
  fieldClasses?: string[];
}

export default function Field({
  fieldClasses = [],
  error,
  message,
  children,
}: PropsWithChildren<FieldProps>) {
  const classList = useMemo(() => {
    const classes = ['form-field', ...fieldClasses];
    if (error) {
      classes.push('form-field--error');
    }
    return classes.join(' ');
  }, [fieldClasses, error]);

  return (
    <Box className={classList} pad="medium">
      {children}
      {message && <span className="form-field__message">{message}</span>}
    </Box>
  );
}
