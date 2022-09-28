import type { WidgetProps } from '@rjsf/core';
import { JSONSchema7TypeName } from 'json-schema';
import { ChangeEventHandler } from 'react';

export default interface ShowCaseWidgetProps {
  widgetName: string;
  type: JSONSchema7TypeName;
  isDroppedInSection?: boolean;
}

export interface VernaWidgetProps extends WidgetProps {
  onChange: WidgetProps['onChange'] & ChangeEventHandler<unknown>;
}
