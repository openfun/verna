import { IntlFormatters } from '@formatjs/intl';
import { cleanUiSchema, useVerna } from '@openfun/verna';
import { VernaSchemaType } from '@openfun/verna/dist/types/rjsf';
import { Maybe } from '@openfun/verna/dist/types/utils';
import { Box, Button } from 'grommet';
import { Edit, FormDown, FormUp, Trash } from 'grommet-icons';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { FormStatusEnum } from ':/components/FormWrapper/FormWrapper';
import PollResume from ':/components/Poll/PollResume';
import Section from ':/components/VernaOverride/Section';

export const messages = defineMessages({
  defaultSectionName: {
    defaultMessage: 'Poll without title',
    description: 'The default name of a poll newly created',
    id: 'components.Poll.defaultSectionName',
  },
  newPoll: {
    defaultMessage: 'Add a new poll',
    description: 'Label of the button to add a new poll',
    id: 'components.Poll.newPoll',
  },
});

interface PollProperties {
  schemaForm: VernaSchemaType[];
  setFormStatus: (newStatus: FormStatusEnum) => void;
  setPollSelected: React.Dispatch<React.SetStateAction<number | null>>;
  setSchemaForm: React.Dispatch<React.SetStateAction<VernaSchemaType[]>>;
  stats: Maybe<Record<string, Record<string, Record<string, number>>>>;
}

export default function Poll({
  schemaForm,
  setFormStatus,
  setPollSelected,
  setSchemaForm,
  stats,
}: PollProperties) {
  const { isEditor, setSchema } = useVerna();
  const { formatMessage } = useIntl();
  const confButtonMargins = { left: '15px', right: '5px' };

  function moveUpSection(index: number) {
    const tmp = schemaForm[index];
    schemaForm[index] = schemaForm[index - 1];
    schemaForm[index - 1] = tmp;
    setSchemaForm([...schemaForm]);
  }

  function moveDownSection(index: number) {
    const tmp = schemaForm[index];
    schemaForm[index] = schemaForm[index + 1];
    schemaForm[index + 1] = tmp;
    setSchemaForm([...schemaForm]);
  }

  function createSchemaFormObject(
    formatMessage: IntlFormatters<React.ReactNode>['formatMessage'],
  ): VernaSchemaType {
    const uuid = uuidv4();
    return {
      formSchema: {
        properties: {
          [uuid]: {
            properties: {},
            title: formatMessage(messages.defaultSectionName),
            type: 'object',
          },
        },
        type: 'object',
      },
      translationSchema: {},
      uiSchema: {},
    };
  }

  return (
    <div className="form-sections-list">
      {schemaForm.map((poll, index) => (
        <Box
          key={`pollResume-${index}`}
          background={{ color: 'rgba(145 110 208 / 18%)' }}
          direction="row"
          pad="15px"
          style={{ borderRadius: '10px' }}
        >
          <PollResume
            key={`pollResume-${index}`}
            index={index}
            poll={poll}
            setFormStatus={setFormStatus}
            setPollSelected={setPollSelected}
            statsData={stats}
          />
          {isEditor && (
            <Box direction="column" gap="50px">
              <Box align="center" gap="10px" justify="center" margin={{ top: '20px' }} width="60px">
                <Button
                  primary
                  disabled={index === 0}
                  icon={<FormUp />}
                  margin={confButtonMargins}
                  onClick={() => moveUpSection(index)}
                />
                <Button
                  primary
                  disabled={index === schemaForm.length - 1}
                  icon={<FormDown />}
                  margin={confButtonMargins}
                  onClick={() => moveDownSection(index)}
                />
              </Box>
              <Box
                align="center"
                alignSelf="center"
                gap="10px"
                justify="center"
                margin={{ bottom: '20px' }}
                width="60px"
              >
                <Button
                  primary
                  icon={<Edit />}
                  margin={confButtonMargins}
                  size="small"
                  onClick={() => {
                    setPollSelected(index);
                    setSchema({
                      ...poll,
                      uiSchema: cleanUiSchema(
                        poll.formSchema || {},
                        {
                          ...poll.uiSchema,
                          'ui:submitButtonOptions': {
                            norender: true,
                          },
                        },
                        Section,
                      ),
                    });
                  }}
                />
                <Button
                  primary
                  icon={<Trash />}
                  margin={confButtonMargins}
                  size="small"
                  onClick={() => {
                    const newSchemaForm = [...schemaForm];
                    newSchemaForm.splice(index, 1);
                    setSchemaForm(newSchemaForm);
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      ))}
      {isEditor && (
        <Button
          primary
          label={formatMessage(messages.newPoll)}
          size="small"
          onClick={() => {
            const newSchemaForm = [...schemaForm];
            newSchemaForm.splice(schemaForm.length, 0, createSchemaFormObject(formatMessage));
            setSchemaForm(newSchemaForm);
          }}
        />
      )}
    </div>
  );
}
