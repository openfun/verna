import { type ShowCaseWidgetProps } from '@openfun/verna';
import { defineMessages, useIntl } from 'react-intl';
import WidgetWrapper from './WidgetWrapper';

export const messages = defineMessages({
  TextareaWidget: {
    defaultMessage: 'Free large answer question',
    description: 'Label of the textarea widget',
    id: 'widgetToolbarItems.TextareaWidget',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function TextareaWidget(props: ShowCaseWidgetProps) {
  const { formatMessage } = useIntl();

  return <WidgetWrapper>{formatMessage(messages.TextareaWidget)}</WidgetWrapper>;
}
