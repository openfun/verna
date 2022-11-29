import { JSONSchema7TypeName } from 'json-schema';
import { defineMessages, IntlShape } from 'react-intl';

const messages = defineMessages({
  CheckboxWidget: {
    defaultMessage: 'Yes/no question',
    description: 'Label of the checkbox widget',
    id: 'widgetToolbarItems.CheckboxWidget',
  },
  CheckboxesWidget: {
    defaultMessage: 'Multiple choice question',
    description: 'Label of the multiple choices widget',
    id: 'widgetToolbarItems.CheckboxesWidget',
  },
  NumberWidget: {
    defaultMessage: 'Numerical question',
    description: 'Label of the number widget',
    id: 'widgetToolbarItems.NumberWidget',
  },
  SelectWidget: {
    defaultMessage: 'Single choice question',
    description: 'Label of the select widget',
    id: 'widgetToolbarItems.SelectWidget',
  },
  TextWidget: {
    defaultMessage: 'Free answer question',
    description: 'Label of the text widget',
    id: 'widgetToolbarItems.TextWidget',
  },
  TextareaWidget: {
    defaultMessage: 'Free large answer question',
    description: 'Label of the textarea widget',
    id: 'widgetToolbarItems.TextareaWidget',
  },
});

export interface SelectWidgetType {
  text: string;
  type: JSONSchema7TypeName;
  widgetName: string;
}

export const getLocalizedWidgetDefinitions = (intl: IntlShape) =>
  [
    {
      text: intl.formatMessage(messages.TextWidget),
      type: 'string',
      widgetName: 'textWidget',
    },
    {
      text: intl.formatMessage(messages.TextareaWidget),
      type: 'string',
      widgetName: 'textareaWidget',
    },
    {
      text: intl.formatMessage(messages.NumberWidget),
      type: 'number',
      widgetName: 'numberWidget',
    },
    {
      text: intl.formatMessage(messages.CheckboxWidget),
      type: 'boolean',
      widgetName: 'checkboxWidget',
    },
    {
      text: intl.formatMessage(messages.CheckboxesWidget),
      type: 'array',
      widgetName: 'checkboxesWidget',
    },
    {
      text: intl.formatMessage(messages.SelectWidget),
      type: 'string',
      widgetName: 'selectWidget',
    },
  ] as SelectWidgetType[];
