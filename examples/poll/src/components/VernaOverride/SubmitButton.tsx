import { useVerna } from '@openfun/verna';
import { Button } from 'grommet';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  submitButtonText: {
    defaultMessage: 'Submit',
    description: 'The text wrote on the submit button used to submit answers of a poll',
    id: 'components.VernaOverride.SubmitButton.submitButtonText',
  },
});

export default function SubmitButton() {
  const { formatMessage } = useIntl();
  const { isEditor, schema } = useVerna();

  if (!isEditor || schema.formSchema?.type === 'object')
    return <Button label={formatMessage(messages.submitButtonText)} type="submit" />;
  return <></>;
}
