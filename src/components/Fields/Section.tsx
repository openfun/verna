import type { ObjectFieldTemplateProps } from '@rjsf/core';
import DropZone from '../EditorFieldTemplate/DropZone';
import { useVerna } from '../../providers/VernaProvider';

export default function Section({ title, idSchema, properties }: ObjectFieldTemplateProps) {
  const { isEditor } = useVerna();

  return (
    <fieldset>
      <legend>{title}</legend>
      {isEditor && <DropZone id={idSchema['$id']} />}
      {properties.map((element) => element.content)}
    </fieldset>
  );
}
