import React from 'react';
import type { ObjectFieldTemplateProps } from '@rjsf/core';
import DropZone from './DropZone';
import { useVerna } from '../context/VernaContextProvider';

export default function Section(props: ObjectFieldTemplateProps) {
  const { isEditor } = useVerna();

  return (
    <fieldset>
      {isEditor && <DropZone id={props.idSchema['$id']} />}
      {props.properties.map((element) => element.content)}
    </fieldset>
  );
}
