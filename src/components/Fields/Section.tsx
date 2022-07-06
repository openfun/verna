import { defineMessages, FormattedMessage } from 'react-intl';
import type { ObjectFieldTemplateProps } from '@rjsf/core';
import React, { useState } from 'react';
import DropZone from '../EditorFieldTemplate/DropZone';
import { useVerna } from '../../providers/VernaProvider';
import SectionPropertiesForm from '../PropertiesForms/SectionPropertiesForm';

const messages = defineMessages({
  parameters: {
    defaultMessage: 'Parameters',
    description: 'Label of the button to display the section properties form',
    id: 'components.fields.section.parameters',
  },
});

export default function Section({
  title,
  idSchema,
  properties,
  description,
}: ObjectFieldTemplateProps) {
  const { isEditor, selector } = useVerna();
  const [isEditingParameters, setIsEditingParameters] = useState(false);
  const isRoot = idSchema.$id === 'root';

  // Display drop zone at the top of the section only if in editor mode and if it's not the
  // primary section in the case where there aren't any selector
  const ownDropZone = isEditor && !(!selector && isRoot);

  return (
    <fieldset>
      <legend>{title}</legend>
      <p>{description}</p>
      <button onClick={() => setIsEditingParameters(!isEditingParameters)}>
        <FormattedMessage {...messages.parameters} />
      </button>
      {isEditingParameters && (
        <SectionPropertiesForm id={idSchema.$id} onClose={() => setIsEditingParameters(false)} />
      )}
      {ownDropZone && <DropZone id={idSchema['$id']} />}
      {properties.map((element) => element.content)}
    </fieldset>
  );
}
