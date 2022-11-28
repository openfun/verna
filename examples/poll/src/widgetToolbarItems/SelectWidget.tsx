import { type ShowCaseWidgetProps } from '@openfun/verna';
import { defineMessages, useIntl } from 'react-intl';
import WidgetWrapper from './WidgetWrapper';

export const messages = defineMessages({
  SelectWidget: {
    defaultMessage: 'Single choice question',
    description: 'Label of the select widget',
    id: 'widgetToolbarItems.SelectWidget',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SelectWidget(props: ShowCaseWidgetProps) {
  const { formatMessage } = useIntl();

  return <WidgetWrapper>{formatMessage(messages.SelectWidget)}</WidgetWrapper>;
}
