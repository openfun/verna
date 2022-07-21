import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useVerna } from ':/providers/VernaProvider';
import ShowCaseWidgetProps from ':/types/Widgets';
import { addWidget } from ':/utils/schema';

export interface DropZoneProps {
  id: string;
}

export default function DropZone({ id }: DropZoneProps) {
  const [draggingOver, setDraggingOver] = useState(false);
  const verna = useVerna();

  function addItem(widgetProps?: ShowCaseWidgetProps) {
    if (!id) return;
    const newKey = uuidv4();
    addWidget(newKey, id, verna, widgetProps);
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
      <div className={draggingOver ? 'drop-zone-divider-drag-over' : 'drop-zone-divider'} />
    </div>
  );
}
