import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useVerna } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import ShowCaseWidgetProps from ':/types/Widgets';

export interface DropZoneProps {
  id: string;
  render?: React.FunctionComponent<DropZoneOverloadProps>;
  isSection?: boolean;
}

export interface DropZoneOverloadProps {
  isDraggingOver: boolean;
}

export default function DropZone({ id, isSection, render: DropZoneOverload }: DropZoneProps) {
  const [draggingOver, setDraggingOver] = useState(false);
  const verna = useVerna();
  const intl = useIntl();

  function addItem(widgetProps: ShowCaseWidgetProps) {
    if (!id) return;
    verna.addVernaWidget(
      id,
      {
        ...widgetProps,
        isDroppedInSection:
          isSection || (id.split(RJSF_ID_SEPARATOR).length <= 2 && !verna.selector),
      },
      intl,
    );
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const widgetProps = JSON.parse(event.dataTransfer.getData('object'));
    addItem(widgetProps);
    setDraggingOver(false);
  }

  function onDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDraggingOver(true);
  }

  return (
    <div
      className={draggingOver ? 'drop-zone-drag-over' : 'drop-zone'}
      onDragLeave={() => setDraggingOver(false)}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {DropZoneOverload ? (
        <DropZoneOverload isDraggingOver={draggingOver} />
      ) : (
        <div className={draggingOver ? 'drop-zone-divider-drag-over' : 'drop-zone-divider'} />
      )}
    </div>
  );
}
