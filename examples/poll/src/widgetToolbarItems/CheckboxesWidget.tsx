import { type ShowCaseWidgetProps } from '@openfun/verna';
import { defineMessages, useIntl } from 'react-intl';
import WidgetWrapper from './WidgetWrapper';

const messages = defineMessages({
  CheckboxesWidget: {
    defaultMessage: 'Multiple choice question',
    description: 'Label of the multiple choices widget',
    id: 'widgetToolbarItems.CheckboxesWidget',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CheckboxesWidget(props: ShowCaseWidgetProps) {
  const { formatMessage } = useIntl();

  return <WidgetWrapper>{formatMessage(messages.CheckboxesWidget)}</WidgetWrapper>;
}
