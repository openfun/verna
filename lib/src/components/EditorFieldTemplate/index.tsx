import type { FieldTemplateProps } from '@rjsf/core';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import WidgetPropertiesForm from ':/components/PropertiesForms/WidgetPropertiesForm';
import { useVerna } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';

const messages = defineMessages({
  addInput: {
    defaultMessage: 'Add an input',
    description: 'Label of the button to add an input',
    id: 'components.EditorFieldTemplate.addInput',
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
export default function EditorFieldTemplate({
  id,
  schema: formSchema,
  children,
}: FieldTemplateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const verna = useVerna();
  const path = id.split(RJSF_ID_SEPARATOR);
  const isRoot = id === 'root';
  const isSection = path.length === 2 && !verna.selector;
  const canAddField = formSchema.type !== 'object';
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
            {(canAddField || canAddSection) && (
              <button onClick={() => verna.removeVernaProperty(id)} style={buttonStyle}>
                x
              </button>
            )}
          </div>
          {isEditing && <WidgetPropertiesForm id={id} onClose={() => setIsEditing(false)} />}
          {!(verna.selector && isRoot) && <DropZone id={id} />}
        </>
      )}
    </div>
  );
}
