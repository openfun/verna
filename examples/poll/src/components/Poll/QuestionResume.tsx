import { useVerna } from '@openfun/verna';
import { VernaSchemaType } from '@openfun/verna/dist/types/rjsf';
import { Maybe } from '@openfun/verna/dist/types/utils';
import { Box, Card, CardBody, Meter, Text } from 'grommet';
import _ from 'lodash';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

interface QuestionResumeProperties {
  question: string;
  questionData: Maybe<Record<string, number>>;
  poll: VernaSchemaType;
}

const messages = defineMessages({
  answers: {
    defaultMessage: '{count, plural, =0 {no answers} one {# Answer} other {# Answers}}',
    description: 'Text beside the number of answers for a poll',
    id: 'components.PollResume.QuestionResume.answers',
  },
});

export default function QuestionResume({ question, questionData, poll }: QuestionResumeProperties) {
  const { isEditor, schema } = useVerna();
  const { formatMessage, locale } = useIntl();

  const nbAnswers =
    _.reduce(questionData, (total: number, current: number) => total + current) || 0;
  const pollRJSF =
    poll.formSchema?.properties?.[Object.keys(poll.formSchema.properties)[0]]?.properties?.[
      question
    ];
  if (!pollRJSF) return <></>;

  const hasAnswered = JSON.parse(localStorage.getItem('vernaExampleData-hasAnswered') || '{}');

  const keysToCheck = () => {
    return Object.keys(questionData || {}).filter((key) => {
      if ('enum' in pollRJSF) {
        return pollRJSF.enum!.includes(key);
      }
      return true;
    });
  };

  function translateItemsLabel(dataName: string) {
    return dataName
      .split(',')
      .map((value) => {
        return formatMessage({ id: value });
      })
      .join(', ');
  }

  return (
    <Card background="rgba(145 110 208 / 18%)" style={{ marginBottom: '15px', padding: '15px' }}>
      <CardBody>
        {pollRJSF?.title && (
          <legend>
            <FormattedMessage defaultMessage={[]} id={pollRJSF.title} />
          </legend>
        )}
        {pollRJSF?.description && (
          <p>
            <FormattedMessage defaultMessage={[]} id={pollRJSF.description} />
            <br />
          </p>
        )}
        <small>
          <FormattedMessage values={{ count: nbAnswers }} {...messages.answers} />
        </small>
        {(isEditor || hasAnswered[Object.keys(poll.formSchema?.properties || {})[0]]) && (
          <Box direction="column" gap="10px">
            {keysToCheck().map((dataName: string, index) => {
              const label = Object.keys(schema.translationSchema?.[locale] || {}).includes(dataName)
                ? formatMessage({ defaultMessage: [], id: dataName })
                : translateItemsLabel(dataName);
              if (!questionData) return;
              const value = questionData[dataName];
              const percentage = parseFloat(
                Number(nbAnswers ? (value / nbAnswers) * 100 : 0).toFixed(1),
              );

              return (
                <Box
                  key={`${index}-${dataName}`}
                  flex
                  direction="row"
                  style={{ alignItems: 'center', gap: '10px' }}
                >
                  <div style={{ alignSelf: 'flex-start', position: 'relative' }}>
                    <div style={{ position: 'absolute' }}>
                      <Box align="center" direction="row" margin={{ left: '20px', top: '8px' }}>
                        <Text
                          color="white"
                          size="small"
                          style={{ whiteSpace: 'nowrap' }}
                          weight="bold"
                        >
                          {label}
                        </Text>
                      </Box>
                    </div>
                  </div>
                  <Meter
                    key={dataName}
                    round
                    background="rgba(125,76,219,0.31)"
                    direction="horizontal"
                    max={100}
                    size="medium"
                    thickness="medium"
                    type="bar"
                    values={[
                      {
                        color: '#6a2ba6',
                        label: label,
                        value: percentage,
                      },
                    ]}
                  />
                  <Box align="center" direction="row" pad={{ bottom: 'xsmall' }}>
                    <Text size="large" weight="bold">
                      {percentage}
                    </Text>
                    <Text size="small">%</Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </CardBody>
    </Card>
  );
}
