import { type ShowCaseWidgetProps } from '@openfun/verna';
import { defineMessages, useIntl } from 'react-intl';
import WidgetWrapper from './WidgetWrapper';

const messages = defineMessages({
  TextWidget: {
    defaultMessage: 'Free answer question',
    description: 'Label of the text widget',
    id: 'widgetToolbarItems.TextWidget',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TextWidget(props: ShowCaseWidgetProps) {
  const { formatMessage } = useIntl();

  return <WidgetWrapper>{formatMessage(messages.TextWidget)}</WidgetWrapper>;
}
