import React, { useState } from 'react';
import type { FieldTemplateProps } from '@rjsf/core';
import { defineMessages, FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import ShowCaseWidgetProps from ':/types/Widgets';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { useVerna } from ':/providers/VernaProvider';
import { addWidget, addSection } from ':/utils/schema';
import WidgetPropertiesForm from ':/components/PropertiesForms/WidgetPropertiesForm';
import { removeSection, removeWidget } from ':/utils/schema';

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
  const DropZone = verna.DropZone;
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
          <button onClick={() => setIsEditing(!isEditing)}>
            <FormattedMessage {...messages.parameters} />
          </button>
          {isEditing && <WidgetPropertiesForm id={id} onClose={() => setIsEditing(false)} />}
          {!(verna.selector && isRoot) && <DropZone id={id} />}
        </>
      )}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {(canAddField ||
          (!ownProperties && isSection && !isRoot) ||
          (verna.selector && !ownProperties)) && (
          <button onClick={() => addItem()} style={{ flex: 1 }}>
            <FormattedMessage {...messages.addInput} />
          </button>
        )}
        {(canAddSection || (isRoot && !ownProperties && !verna.selector)) && (
          <button onClick={() => addSection(verna, id, verna.Section)} style={{ flex: 1 }}>
            <FormattedMessage {...messages.addSection} />
          </button>
        )}
        {canAddField && <button onClick={() => removeWidget(verna, id)}>x</button>}
        {canAddSection && <button onClick={() => removeSection(verna, id)}>x</button>}
      </div>
    </div>
  );
}
