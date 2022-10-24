import React, { ReactElement } from 'react';
import ShowCaseWidgetProps from ':/types/Widgets';

interface VernaToolbarProps {
  children: ReactElement[];
  onDragEnd: () => void;
  onDragStart: () => void;
}

export default function VernaToolbar({ children, onDragEnd, onDragStart }: VernaToolbarProps) {
  function onDrag(event: React.DragEvent<HTMLSpanElement>, child: ReactElement) {
    onDragStart();
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
        <span
          draggable
          onDragEnd={() => onDragEnd()}
          onDragStart={(e) => onDrag(e, child)}
          style={{ cursor: 'grab' }}
        >
          {child}
        </span>
      ))}
    </>
  );
}

VernaToolbar.defaultProps = {
  onDragEnd: () => undefined,
  onDragStart: () => undefined,
};
