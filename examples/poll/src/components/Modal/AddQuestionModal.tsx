import { RJSF_ID_SEPARATOR, useVerna } from '@openfun/verna';
import { Maybe } from '@openfun/verna/dist/types/utils';
import { Box, Button, Layer, Select, Text } from 'grommet';
import _ from 'lodash';
import React, { useMemo, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import {
  getLocalizedWidgetDefinitions,
  SelectWidgetType,
} from ':/data/getLocalizedWidgetDefinitions';

const messages = defineMessages({
  addQuestion: {
    defaultMessage: 'Add',
    description: 'Label of the button to add a new question',
    id: 'components.VernaOverride.Section.addQuestion',
  },
  addQuestionTextModal: {
    defaultMessage: 'Select a type of question to add',
    description: 'Text of modal to add a new question',
    id: 'components.VernaOverride.Section.addQuestionTextModal',
  },
  closeModal: {
    defaultMessage: 'Close',
    description: 'Label of the button to close the modal to add a new question',
    id: 'components.VernaOverride.Section.closeModal',
  },
  newQuestion: {
    defaultMessage: 'Add a new question',
    description: 'Label of the button to add a new question',
    id: 'components.VernaOverride.Section.newQuestion',
  },
});

interface AddQuestionModalProperties {
  idParts: string[];
  setIsNewPollModalVisible: (newValue: boolean) => void;
}

export default function AddQuestionModal({
  idParts,
  setIsNewPollModalVisible,
}: AddQuestionModalProperties) {
  const intl = useIntl();
  const { addVernaWidget, selector, schema } = useVerna();
  const [widget, setWidget] = useState<Maybe<SelectWidgetType>>();
  const lastWidget = _.last(schema.uiSchema?.[idParts[1]]['ui:order']);

  return (
    <Layer
      onClickOutside={() => setIsNewPollModalVisible(false)}
      onEsc={() => setIsNewPollModalVisible(false)}
    >
      <Box gap="20px" pad="20px">
        <Text>
          <FormattedMessage {...messages.addQuestionTextModal} />
        </Text>
        <Select
          labelKey="text"
          options={useMemo(() => getLocalizedWidgetDefinitions(intl), [intl])}
          onChange={(event) => {
            setWidget(event.value);
          }}
        />
        <Box direction="row" gap="15px">
          <Button
            label={intl.formatMessage(messages.closeModal)}
            onClick={() => setIsNewPollModalVisible(false)}
          />
          <Button
            disabled={!widget}
            label={intl.formatMessage(messages.addQuestion)}
            onClick={() => {
              addVernaWidget(
                [...idParts, lastWidget].join(RJSF_ID_SEPARATOR),
                {
                  isDroppedInSection: idParts.length <= 2 && !selector,
                  type: widget!.type,
                  widgetName: widget!.widgetName,
                },
                intl,
              );
              setIsNewPollModalVisible(false);
            }}
          />
        </Box>
      </Box>
    </Layer>
  );
}
