import type { VernaWidgetProps } from '@openfun/verna/dist/types/Widgets';
import { TextTemplateWidget } from './templates/TextTemplateWidget';

export default function PasswordWidget(props: VernaWidgetProps) {
  return (
    <>
      <TextTemplateWidget
        disabled={props.disabled}
        error={!!props.rawErrors}
        fieldClasses={['testclass']}
        id={props.id}
        label={props.label}
        onChange={(event) => props.onChange(event.target.value)}
        required={props.required}
        type="password"
        value={props.value}
      />
      {props.required && '*'}
      {props.rawErrors}
    </>
  );
}
