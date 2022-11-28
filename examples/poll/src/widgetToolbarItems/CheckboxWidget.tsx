import { type ShowCaseWidgetProps } from '@openfun/verna';
import { defineMessages, useIntl } from 'react-intl';
import WidgetWrapper from './WidgetWrapper';

export const messages = defineMessages({
  CheckboxWidget: {
    defaultMessage: 'Yes/no question',
    description: 'Label of the checkbox widget',
    id: 'widgetToolbarItems.CheckboxWidget',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CheckboxWidget(props: ShowCaseWidgetProps) {
  const { formatMessage } = useIntl();

  return <WidgetWrapper>{formatMessage(messages.CheckboxWidget)}</WidgetWrapper>;
}
