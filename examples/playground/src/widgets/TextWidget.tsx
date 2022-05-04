import { TextTemplateWidget } from './templates/TextTemplateWidget';
import { VernaWidgetProps } from '../../../../src/types/Widgets';

export default function TextWidget(props: VernaWidgetProps) {
  console.log('PROPS:', props);
  return (
    <>
      <TextTemplateWidget
        disabled={props.disabled}
        error={!!props.rawErrors}
        fieldClasses={['testclass']}
        id={props.id || ''}
        label={props.label}
        onChange={(event) => props.onChange(event.target.value)}
        required={props.required}
        type="text"
        value={props.value}
      />
      {props.required && '*'}
      {props.rawErrors}
    </>
  );
}
