import React, { useState } from 'react';
import type { FieldTemplateProps } from '@rjsf/core';
import { defineMessages, FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import ShowCaseWidgetProps from '../../types/Widgets';
import DropZone from './DropZone';
import { RJSF_ID_SEPARATOR } from '../../settings';
import { useVerna } from '../../providers/VernaProvider';
import { addWidget, addSection } from '../../utils/schema';
import WidgetPropertiesForm from '../WidgetPropertiesForm';
import { removeSection, removeWidget } from '../../utils/schema';
import { Box } from 'grommet';

const messages = defineMessages({
  parameters: {
    defaultMessage: 'Parameters',
    description: 'Label of the button to display the widget properties form',
    id: 'components.EditorFieldTemplate.parameters',
  },
});

/**
 * This component wraps each form fields.
 * Its purpose here is to add edition capabilities to every of those
 * when editor mode is enabled.
 */
export default function EditorFieldTemplate({ id, schema, children }: FieldTemplateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const verna = useVerna();
  const path = id.split(RJSF_ID_SEPARATOR);
  const isRoot = id === 'root';
  const isSection = path.length === 2 && !verna.selector;
  const ownProperties = Object.keys(schema.properties || {}).length > 0;
  const canAddField = schema.type !== 'object';
  const canAddSection = isSection && !isRoot && !verna.selector;

  function addItem(widgetProps?: ShowCaseWidgetProps) {
    const newKey = uuidv4();
    addWidget(newKey, id, verna, widgetProps);
  }

  if (!verna.isEditor) return children;

  return (
    <div>
      {children}
      {!isSection && (!isRoot || verna.selector) && (
        <>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button onClick={() => setIsEditing(!isEditing)}>
              <FormattedMessage {...messages.parameters} />
            </button>
            {canAddField && (
              <button
                onClick={() => removeWidget(verna, id)}
                style={{ width: '24px', height: '24px' }}
              >
                x
              </button>
            )}
            {canAddSection && (
              <button
                onClick={() => removeSection(verna, id)}
                style={{ width: '24px', height: '24px' }}
              >
                x
              </button>
            )}
          </div>
          {isEditing && <WidgetPropertiesForm id={id} onClose={() => setIsEditing(false)} />}
          <DropZone id={id} />
        </>
      )}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {(canAddSection || (isRoot && !ownProperties && !verna.selector)) && (
          <button
            onClick={() => addSection(verna, id, verna.objectFieldTemplate)}
            style={{ width: '100%' }}
          >
            Add a section
          </button>
        )}
      </div>
    </div>
  );
}
