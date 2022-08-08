import type { FieldTemplateProps } from '@rjsf/core';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import WidgetPropertiesForm from ':/components/PropertiesForms/WidgetPropertiesForm';
import { useVerna } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { addSection, removeSection, removeWidget } from ':/utils/schema';

const messages = defineMessages({
  addInput: {
    defaultMessage: 'Add an input',
    description: 'Label of the button to add an input',
    id: 'components.EditorFieldTemplate.addInput',
  },
  addSection: {
    defaultMessage: 'Add a section',
    description: 'Label of the button to add a section',
    id: 'components.EditorFieldTemplate.addSection',
  },
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
  const DropZone = verna.DropZone;
  const buttonStyle = { height: '24px', width: '24px' };

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
              <button onClick={() => removeWidget(verna, id)} style={buttonStyle}>
                x
              </button>
            )}
            {canAddSection && (
              <button onClick={() => removeSection(verna, id)} style={buttonStyle}>
                x
              </button>
            )}
          </div>
          {isEditing && <WidgetPropertiesForm id={id} onClose={() => setIsEditing(false)} />}
          {!(verna.selector && isRoot) && <DropZone id={id} />}
        </>
      )}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {(canAddSection || (isRoot && !ownProperties && !verna.selector)) && (
          <button onClick={() => addSection(verna, id, verna.Section)} style={{ flex: 1 }}>
            <FormattedMessage {...messages.addSection} />
          </button>
        )}
        {canAddSection && <button onClick={() => removeSection(verna, id)}>x</button>}
      </div>
    </div>
  );
}
