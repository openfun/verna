import type { ObjectFieldTemplateProps } from '@rjsf/core';
import _ from 'lodash';
import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import SectionPropertiesForm from ':/components/PropertiesForms/SectionPropertiesForm';
import { useVerna } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import { VernaSchemaType } from ':/types/rjsf';
import { Maybe } from ':/types/utils';

const messages = defineMessages({
  addSection: {
    defaultMessage: 'Add a section',
    description: 'Label of the button to add a section',
    id: 'components.fields.section.addSection',
  },
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
  uiSchema,
}: ObjectFieldTemplateProps) {
  const { addVernaSection, isEditor, DropZone, removeVernaProperty, schema, selector } = useVerna();
  const [isEditingParameters, setIsEditingParameters] = useState(false);
  const hasSection = doesContainSection(idSchema['$id'], schema, selector);
  const isRoot = idSchema['$id'] === 'root';

  function getLastPropertyId() {
    const sectionList = uiSchema['ui:order'];

    if (!sectionList || sectionList.length === 0) {
      return null;
    }
    const lastPropertyName = sectionList[sectionList?.length - 1];
    return ['root', lastPropertyName].join(RJSF_ID_SEPARATOR);
  }

  return (
    <fieldset>
      <legend>{title}</legend>
      <p>{description}</p>
      {isEditor && (
        <>
          <button onClick={() => setIsEditingParameters(!isEditingParameters)}>
            <FormattedMessage {...messages.parameters} />
          </button>
          {idSchema['$id'] !== 'root' && (
            <button onClick={() => removeVernaProperty(idSchema['$id'])}>x</button>
          )}
        </>
      )}
      {isEditingParameters && (
        <SectionPropertiesForm id={idSchema.$id} onClose={() => setIsEditingParameters(false)} />
      )}
      {isEditor && !hasSection && <DropZone isSection id={idSchema['$id']} />}
      {properties.map((element) => element.content)}
      {isEditor && isRoot && (
        <button onClick={() => addVernaSection(getLastPropertyId())} style={{ flex: 1 }}>
          <FormattedMessage {...messages.addSection} />
        </button>
      )}
    </fieldset>
  );
}
