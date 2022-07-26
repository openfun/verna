import { Box } from 'grommet';
import React from 'react';
import './styles/DropZone.scss';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDnd } from ':/providers/DragAndDropProvider';

const messages = defineMessages({
  descriptionDraggingOver: {
    defaultMessage: 'Drop here',
    description: 'The description written in the drop zone when dragging over',
    id: 'components.VernaOverride.DropZone.descriptionDraggingOver',
  },
});

export default function DropZone() {
  const [isDragging] = useDnd();

  return (
    <Box align="center" justify="center">
      <div className={isDragging ? 'drop-zone-divider' : 'hidden-drop-zone'}>
        {isDragging && <FormattedMessage {...messages.descriptionDraggingOver} />}
      </div>
    </Box>
  );
}
