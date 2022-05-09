import React, { ReactElement } from 'react';
import ShowCaseWidgetProps from '../../types/Widgets';

interface VernaToolbarProps {
  children: ReactElement[];
}

export default function VernaToolbar({ children }: VernaToolbarProps) {
  function onDrag(event: React.DragEvent<HTMLSpanElement>, child: ReactElement) {
    if (event.dataTransfer) {
      const childProps = child.props;
      event.dataTransfer.setData(
        'object',
        JSON.stringify({
          type: childProps['type'],
          widgetName: childProps['widgetName'],
        } as ShowCaseWidgetProps),
      );
      event.dataTransfer.dropEffect = 'move';
    }
  }

  return (
    <>
      {React.Children.map(children, (child) => (
        <span draggable onDragStart={(e) => onDrag(e, child)} style={{ cursor: 'grab' }}>
          {child}
        </span>
      ))}
    </>
  );
}
