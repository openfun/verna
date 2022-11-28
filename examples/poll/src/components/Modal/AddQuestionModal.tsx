import { RJSF_ID_SEPARATOR, useVerna } from '@openfun/verna';
import { Box, Button, Layer, Select, Text } from 'grommet';
import _ from 'lodash';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { messages as CheckboxesWidgetMessages } from ':/widgetToolbarItems/CheckboxesWidget';
import { messages as CheckboxWidgetMessages } from ':/widgetToolbarItems/CheckboxWidget';
import { messages as NumberWidgetMessages } from ':/widgetToolbarItems/NumberWidget';
import { messages as SelectWidgetMessages } from ':/widgetToolbarItems/SelectWidget';
import { messages as TextareaWidgetMessages } from ':/widgetToolbarItems/TextareaWidget';
import { messages as TextWidgetMessages } from ':/widgetToolbarItems/TextWidget';

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
  const [widget, setWidget] = useState<any>();
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
          onChange={(newValue) => setWidget(newValue)}
          options={[
            intl.formatMessage(TextWidgetMessages.TextWidget),
            intl.formatMessage(TextareaWidgetMessages.TextareaWidget),
            intl.formatMessage(NumberWidgetMessages.NumberWidget),
            intl.formatMessage(CheckboxWidgetMessages.CheckboxWidget),
            intl.formatMessage(CheckboxesWidgetMessages.CheckboxesWidget),
            intl.formatMessage(SelectWidgetMessages.SelectWidget),
          ]}
        />
        <Box direction="row" gap="15px">
          <Button
            label={intl.formatMessage(messages.addQuestion)}
            onClick={() => {
              addVernaWidget(
                [...idParts, lastWidget].join(RJSF_ID_SEPARATOR),
                {
                  ...widget!.value!.props,
                  isDroppedInSection: idParts.length <= 2 && !selector,
                },
                intl,
              );
              setIsNewPollModalVisible(false);
            }}
          />
          <Button
            label={intl.formatMessage(messages.closeModal)}
            onClick={() => setIsNewPollModalVisible(false)}
          />
        </Box>
      </Box>
    </Layer>
  );
}
