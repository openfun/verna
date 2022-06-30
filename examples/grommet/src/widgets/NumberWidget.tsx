import { TextTemplateWidget } from './templates/TextTemplateWidget';
import { VernaWidgetProps } from '../../../../src/types/Widgets';

export default function TextWidget(props: VernaWidgetProps) {
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
        type="number"
        value={props.value}
      />
      {props.required && '*'}
      {props.rawErrors}
    </>
  );
}
