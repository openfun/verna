import { JSONSchema7TypeName } from 'json-schema';
import type { WidgetProps } from '@rjsf/core';
import { ChangeEventHandler } from 'react';

export default interface ShowCaseWidgetProps {
  widgetName: string;
  type: JSONSchema7TypeName;
}

export type VernaWidgetProps = Partial<WidgetProps> & { onChange: ChangeEventHandler<unknown> };
