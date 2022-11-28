import { type ShowCaseWidgetProps } from '@openfun/verna';
import { defineMessages, useIntl } from 'react-intl';
import WidgetWrapper from './WidgetWrapper';

export const messages = defineMessages({
  NumberWidget: {
    defaultMessage: 'Numerical question',
    description: 'Label of the number widget',
    id: 'widgetToolbarItems.NumberWidget',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NumberWidget(props: ShowCaseWidgetProps) {
  const { formatMessage } = useIntl();

  return <WidgetWrapper>{formatMessage(messages.NumberWidget)}</WidgetWrapper>;
}
