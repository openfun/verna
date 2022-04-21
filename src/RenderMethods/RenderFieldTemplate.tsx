import React, { useState } from 'react';
import type { FieldTemplateProps } from '@rjsf/core';
import { useVerna } from '../context/VernaContextProvider';
import { makeid, SEPARATOR_ID_RJSF } from '../utils';
import {
  addItemToSchema,
  addItemToUiSchema,
  addSection,
  removeItem,
  removeSection,
} from '../context/InteractionMethods';
import ShowCaseWidgetProps from '../types/Widgets';
import DropZone from '../Widgets/DropZone';
import WidgetParametersConfiguration from '../Widgets/configuration/WidgetParametersConfiguration';

// This component is used to render every field
// Its purpose here is to add functionality common to every of those such as add or remove
// It will be used to add drag and drop area later

export default function RenderFieldTemplate(props: FieldTemplateProps) {
  const { id, schema, children } = props;
  const [isEditing, setIsEditing] = useState(false);
  const verna = useVerna();
  const idParts = id.split(SEPARATOR_ID_RJSF);
  const isRoot = id === 'root';
  const isSection = idParts.length === 2 && !verna.selector;
  const ownProperties = Object.keys(schema.properties || {}).length > 0;
  const canAddField = schema.type !== 'object';
  const canAddSection = isSection && !isRoot && !verna.selector;

  function addItem(widgetProps?: ShowCaseWidgetProps) {
    const newKey = makeid(10);
    addItemToSchema(newKey, id, verna, widgetProps?.type);
    addItemToUiSchema(newKey, id, verna, widgetProps?.widgetName);
  }

  if (!verna.isEditor) return children;

  return (
    <div>
      {children}
      {!isSection && (!isRoot || verna.selector) && (
        <>
          <button onClick={() => setIsEditing(!isEditing)}> Editer </button>
          {isEditing && (
            <WidgetParametersConfiguration onClose={() => setIsEditing(false)} widgetId={id} />
          )}
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
          <button onClick={() => removeItem(verna, id)} style={{ width: '20px' }}>
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
