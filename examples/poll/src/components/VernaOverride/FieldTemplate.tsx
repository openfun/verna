import { WidgetPropertiesForm, RJSF_ID_SEPARATOR, useVerna } from '@openfun/verna';
import type { FieldTemplateProps } from '@rjsf/core';
import { Box, Button } from 'grommet';
import { Edit, FormDown, FormUp, Trash } from 'grommet-icons';
import React, { useState } from 'react';
import AccordionBox from ':/components/AccordionBox';

/**
 * This component wraps each form fields.
 * Its purpose here is to add edition capabilities to every of those
 * when editor mode is enabled.
 */
export default function FieldTemplate({ id, children }: FieldTemplateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const verna = useVerna();
  const path = id.split(RJSF_ID_SEPARATOR);
  const isRoot = id === 'root';
  const DropZone = verna.DropZone;
  const isWidget = path.length === 3;
  const confButtonMargins = { left: '15px', right: '5px' };
  const currentOrder = isWidget ? verna.schema.uiSchema?.[path[1]]?.['ui:order'] : [];
  const index =
    isWidget && currentOrder ? currentOrder.findIndex((widget: string) => widget === path[2]) : 0;

  if (!verna.isEditor) return children;

  function moveWidgetUp() {
    const newOrder = [...currentOrder];
    const tmp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = tmp;
    verna.setSchema({
      ...verna.schema,
      uiSchema: {
        ...verna.schema.uiSchema,
        [path[1]]: {
          ...verna.schema.uiSchema?.[path[1]],
          ['ui:order']: newOrder,
        },
      },
    });
  }

  function moveWidgetDown() {
    const newOrder = [...currentOrder];
    const tmp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = tmp;
    verna.setSchema({
      ...verna.schema,
      uiSchema: {
        ...verna.schema.uiSchema,
        [path[1]]: {
          ...verna.schema.uiSchema?.[path[1]],
          ['ui:order']: newOrder,
        },
      },
    });
  }

  const content = (
    <Box align="center" direction="row" flex="grow" gap="10px" justify="between">
      {children}
      {isWidget && (
        <Box direction="column" flex="shrink" gap="50px">
          <Box align="center" gap="10px" justify="center" margin={{ top: '20px' }} width="60px">
            <Button
              primary
              disabled={index === 0}
              icon={<FormUp />}
              margin={confButtonMargins}
              onClick={() => moveWidgetUp()}
            />
            <Button
              primary
              disabled={index === currentOrder?.length - 1}
              icon={<FormDown />}
              margin={confButtonMargins}
              onClick={() => moveWidgetDown()}
            />
          </Box>
          <Box
            align="center"
            alignSelf="center"
            gap="10px"
            justify="center"
            margin={{ bottom: '20px' }}
            width="60px"
          >
            <Button
              primary
              icon={<Edit />}
              margin={confButtonMargins}
              onClick={() => setIsEditing(!isEditing)}
              size="small"
            />
            <Button
              primary
              icon={<Trash />}
              margin={confButtonMargins}
              onClick={() => verna.removeVernaProperty(id)}
              size="small"
            />
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {isWidget ? (
        <Box
          align="center"
          border={{ color: 'rgba(125,76,219,0.21)', style: 'solid' }}
          direction="row"
          flex="grow"
          margin={{ vertical: '5px' }}
          pad="15px"
          style={{ borderRadius: '5px' }}
        >
          {content}
        </Box>
      ) : (
        <Box align="center" direction="row" flex="grow" margin={{ bottom: '15px', right: '15px' }}>
          {content}
        </Box>
      )}
      <AccordionBox background="white" open={isEditing}>
        {isEditing && <WidgetPropertiesForm id={id} onClose={() => setIsEditing(false)} />}
      </AccordionBox>
      {!isRoot && isWidget && <DropZone id={id} />}
    </>
  );
}
