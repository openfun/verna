import React, { useState } from 'react';
import type { FieldTemplateProps } from '@rjsf/core';
import { makeid } from '../../utils/utils';
import ShowCaseWidgetProps from '../../types/Widgets';
import DropZone from './DropZone';
import { RJSF_ID_SEPARATOR } from '../../settings';
import { useVerna } from '../../providers/VernaProvider';
import { addWidget, addSection } from '../../utils/schema';
import WidgetPropertiesForm from '../WidgetParametersForm';
import { removeSection, removeWidget } from '../../utils/schema';
import { FormattedMessage } from 'react-intl';

/**
 * This component wraps each form fields.
 * Its purpose here is to add edition capabilities to every of those
 * when editor mode is enabled.
 */

export default function EditorFieldTemplate(props: FieldTemplateProps) {
  const { id, schema, children } = props;
  const [isEditing, setIsEditing] = useState(false);
  const verna = useVerna();
  const idParts = id.split(RJSF_ID_SEPARATOR);
  const isRoot = id === 'root';
  const isSection = idParts.length === 2 && !verna.selector;
  const ownProperties = Object.keys(schema.properties || {}).length > 0;
  const canAddField = schema.type !== 'object';
  const canAddSection = isSection && !isRoot && !verna.selector;

  function addItem(widgetProps?: ShowCaseWidgetProps) {
    const newKey = makeid(10);
    addWidget(newKey, id, verna, widgetProps);
  }

  if (!verna.isEditor) return children;

  return (
    <div>
      {children}
      {!isSection && (!isRoot || verna.selector) && (
        <>
          <button onClick={() => setIsEditing(!isEditing)}>
            <FormattedMessage defaultMessage="Parameters" id="widgetParameters" />
          </button>
          {isEditing && <WidgetPropertiesForm id={id} onClose={() => setIsEditing(false)} />}
          <DropZone id={id} />
        </>
      )}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {(canAddField ||
          (!ownProperties && isSection && !isRoot) ||
          (verna.selector && !ownProperties)) && (
          <button onClick={() => addItem()} style={{ width: '100%' }}>
            Add an input
          </button>
        )}
        {(canAddSection || (isRoot && !ownProperties && !verna.selector)) && (
          <button
            onClick={() => addSection(verna, id, verna.objectFieldTemplate)}
            style={{ width: '100%' }}
          >
            Add a section
          </button>
        )}
        {canAddField && (
          <button onClick={() => removeWidget(verna, id)} style={{ width: '20px' }}>
            x
          </button>
        )}
        {canAddSection && (
          <button onClick={() => removeSection(verna, id)} style={{ width: '20px' }}>
            x
          </button>
        )}
      </div>
    </div>
  );
}
