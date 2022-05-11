import type { ObjectFieldTemplateProps } from '@rjsf/core';
import DropZone from '../EditorFieldTemplate/DropZone';
import { useVerna } from '../../providers/VernaProvider';

export default function Section(props: ObjectFieldTemplateProps) {
  const { isEditor } = useVerna();

  return (
    <fieldset>
      {isEditor && <DropZone id={props.idSchema['$id']} />}
      {props.properties.map((element) => element.content)}
    </fieldset>
  );
}
