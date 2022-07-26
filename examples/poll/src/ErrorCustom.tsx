import { IntlFormatters } from '@formatjs/intl';
import type { AjvError } from '@rjsf/core';
import * as React from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  minimum: {
    defaultMessage: 'Nop ! It must be {comparison} to {limit}',
    description: "Error message displayed when minimum required isn't respected",
    id: 'ErrorCustom.minimum',
  },
  pattern: {
    defaultMessage: 'Only digits are allowed',
    description: "Error message displayed when given pattern isn't respected",
    id: 'ErrorCustom.pattern',
  },
});

export default function transformErrors(
  errors: AjvError[],
  formatMessage: IntlFormatters<React.ReactNode>['formatMessage'],
): AjvError[] {
  return errors.map((error) => {
    if (error.name === 'minimum') {
      error.message = formatMessage(messages.minimum, {
        comparison: error.params.comparison,
        limit: error.params.limit,
      });
    }
    if (error.name === 'pattern') {
      error.message = 'Only digits are allowed';
    }
    return error;
  });
}
