import React, { useState } from 'react';
import { useVerna } from ':/providers/VernaProvider';
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

  function addItem(widgetProps: ShowCaseWidgetProps) {
    if (!id) return;
    verna.addVernaWidget(id, { ...widgetProps, isDroppedInSection: isSection });
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
