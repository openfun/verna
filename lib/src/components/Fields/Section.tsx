import type { ObjectFieldTemplateProps } from '@rjsf/core';
import _ from 'lodash';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import SectionPropertiesForm from ':/components/PropertiesForms/SectionPropertiesForm';
import { useVerna } from ':/providers/VernaProvider';
import { VernaSchemaType } from ':/types/rjsf';
import { Maybe } from ':/types/utils';

const messages = defineMessages({
  parameters: {
    defaultMessage: 'Parameters',
    description: 'Label of the button to display the section properties form',
    id: 'components.fields.section.parameters',
  },
});

/**
 * Manage conditions to display or not the dropzone at the top of a section
 * It must not display a dropzone in a section that contains other sections to
 * avoid using widgets and sections at the same level
 *
 * @param id of the section
 * @param schema is the whole schema loaded in the library
 * @param selector is the section name if one is selected
 */
function doesContainSection(id: string, schema: VernaSchemaType, selector: Maybe<string>) {
  if (selector || id !== 'root') return false;
  let containObject = false;
  _.forEach(schema.formSchema?.properties, (section) => {
    if (section.type === 'object') containObject = true;
  });
  return containObject;
}

export default function Section({
  title,
  idSchema,
  properties,
  description,
}: ObjectFieldTemplateProps) {
  const { isEditor, DropZone, schema, selector } = useVerna();
  const [isEditingParameters, setIsEditingParameters] = useState(false);
  const hasSection = doesContainSection(idSchema['$id'], schema, selector);

  return (
    <fieldset>
      <legend>{title}</legend>
      <p>{description}</p>
      {isEditor && (
        <button onClick={() => setIsEditingParameters(!isEditingParameters)}>
          <FormattedMessage {...messages.parameters} />
        </button>
      )}
      {isEditingParameters && (
        <SectionPropertiesForm id={idSchema.$id} onClose={() => setIsEditingParameters(false)} />
      )}
      {isEditor && !hasSection && <DropZone isSection id={idSchema['$id']} />}
      {properties.map((element) => element.content)}
    </fieldset>
  );
}
