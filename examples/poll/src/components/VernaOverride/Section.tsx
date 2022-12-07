import { RJSF_ID_SEPARATOR, SectionPropertiesForm, useVerna } from '@openfun/verna';
import type { ObjectFieldTemplateProps } from '@rjsf/core';
import { Box, Button, Heading, Paragraph } from 'grommet';
import { Configure } from 'grommet-icons';
import React, { useState } from 'react';
import { defineMessages, useIntl, FormattedMessage } from 'react-intl';
import AccordionBox from ':/components/AccordionBox';
import AddQuestionModal from ':/components/Modal/AddQuestionModal';
import { messages as pollMessages } from ':/components/Poll/Poll';

const messages = defineMessages({
  newQuestion: {
    defaultMessage: 'Add a new question',
    description: 'Label of the button to add a new question',
    id: 'components.VernaOverride.Section.newQuestion',
  },
});

export default function Section({
  title,
  idSchema,
  properties,
  description,
}: ObjectFieldTemplateProps) {
  const { formatMessage } = useIntl();
  const { isEditor, DropZone } = useVerna();
  const [isEditingParameters, setIsEditingParameters] = useState(false);
  const [isNewPollModalVisible, setIsNewPollModalVisible] = useState(false);
  const isRoot = idSchema.$id === 'root';

  if (isRoot) return <>{properties.map((element) => element.content)}</>;

  return (
    <Box
      style={{
        flexGrow: '1',
        marginBottom: '15px',
        marginTop: '15px',
        padding: '15px',
      }}
    >
      <Box align="center" direction="row">
        <Heading level="3" style={{ marginBottom: '10px', marginTop: '10px' }}>
          {title || <FormattedMessage {...pollMessages.defaultSectionName} />}
        </Heading>
        {isEditor && (
          <Box
            overflow="hidden"
            round="full"
            style={{ height: '48px', padding: '0', width: '48px' }}
          >
            <Button
              hoverIndicator
              icon={<Configure />}
              onClick={() => setIsEditingParameters(!isEditingParameters)}
              size="small"
            />
          </Box>
        )}
      </Box>
      {description && <Paragraph>{description}</Paragraph>}
      <AccordionBox background="white" open={isEditingParameters}>
        <SectionPropertiesForm id={idSchema.$id} onClose={() => setIsEditingParameters(false)} />
      </AccordionBox>
      {isEditor && <DropZone id={idSchema['$id']} />}
      <Box style={{ flexGrow: '1' }}>{properties.map((element) => element.content)}</Box>
      {isEditor && (
        <Button
          primary
          label={formatMessage(messages.newQuestion)}
          onClick={() => setIsNewPollModalVisible(!isNewPollModalVisible)}
          size="small"
          style={{ marginTop: '10px' }}
        />
      )}
      {isNewPollModalVisible && (
        <AddQuestionModal
          idParts={idSchema.$id.split(RJSF_ID_SEPARATOR)}
          setIsNewPollModalVisible={setIsNewPollModalVisible}
        />
      )}
    </Box>
  );
}
