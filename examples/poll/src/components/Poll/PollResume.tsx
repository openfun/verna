import { useVerna, cleanUiSchema } from '@openfun/verna';
import { VernaSchemaType } from '@openfun/verna/dist/types/rjsf';
import { Maybe } from '@openfun/verna/dist/types/utils';
import { Box, Button, Heading, Paragraph } from 'grommet';
import * as React from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import Section from '../VernaOverride/Section';
import QuestionResume from './QuestionResume';
import { FormStatusEnum } from ':/components/FormWrapper/FormWrapper';

interface PollResumeProperties {
  index: number;
  poll: VernaSchemaType;
  statsData: Maybe<Record<string, Record<string, Record<string, number>>>>;
  setFormStatus: (newStatus: FormStatusEnum) => void;
  setPollSelected: (poll: number | null) => void;
}

const messages = defineMessages({
  noQuestion: {
    defaultMessage: 'There are no question in this poll.',
    description: 'Text preview when there are no questions in a poll',
    id: 'FormWrapper.noQuestion',
  },
  view: {
    defaultMessage: 'Answer',
    description: 'Label of the button to view the section',
    id: 'components.SectionResume.view',
  },
});

export default function PollResume({
  index,
  poll,
  setPollSelected,
  setFormStatus,
  statsData,
}: PollResumeProperties) {
  const { isEditor, setSchema } = useVerna();
  const { formatMessage } = useIntl();
  const pollRJSF = poll.formSchema?.properties?.[Object.keys(poll.formSchema.properties)[0]];
  const pollKey = Object.keys(poll.formSchema?.properties || {})?.[0];

  return (
    <Box flex="grow">
      {pollRJSF?.title && (
        <Heading level="3">
          <FormattedMessage id={pollRJSF.title} />
        </Heading>
      )}
      {pollRJSF?.description && (
        <Paragraph>
          <FormattedMessage defaultMessage={[]} id={pollRJSF.description} />
        </Paragraph>
      )}
      {(poll.uiSchema?.[pollKey]?.['ui:order'] || []).map((question: string) => (
        <QuestionResume
          key={question}
          poll={poll}
          question={question}
          questionData={statsData?.[pollKey]?.[question]}
        />
      ))}
      {(poll.uiSchema?.[pollKey]?.['ui:order'] || []).length === 0 && (
        <Paragraph style={{ fontStyle: 'italic' }}>
          <FormattedMessage {...messages.noQuestion} />
        </Paragraph>
      )}
      {!isEditor && (
        <div>
          <Button
            primary
            label={formatMessage(messages.view)}
            margin={{ top: '10px' }}
            size="small"
            onClick={() => {
              setFormStatus(FormStatusEnum.neutral);
              setPollSelected(index);
              setSchema({
                ...poll,
                uiSchema: cleanUiSchema(
                  poll.formSchema || {},
                  {
                    ...poll.uiSchema,
                    'ui:submitButtonOptions': {
                      norender: false,
                    },
                  },
                  Section,
                ),
              });
            }}
          />
        </div>
      )}
    </Box>
  );
}
