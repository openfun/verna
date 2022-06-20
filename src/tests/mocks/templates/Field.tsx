import { PropsWithChildren, useMemo } from 'react';

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
    <p className={classList}>
      {children}
      {message && <span className="form-field__message">{message}</span>}
    </p>
  );
}
