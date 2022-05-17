import { ReactElement } from 'react';
import { useIntl } from 'react-intl';

export default function translateWidget(element: ReactElement) {
  const widget = element.props.children[0];
  const { formatMessage } = useIntl();
  console.log('PROPS:', widget.props);
  if (widget.props.schema.enum)
    console.log(
      'translated enum:',
      widget.props.schema.enum.map((name: string) => formatMessage({ id: name })),
    );
  return {
    ...element,
    props: {
      children: [
        {
          ...widget,
          props: {
            ...widget.props,
            schema: {
              ...widget.props.schema,
              title: widget.props.schema.title
                ? formatMessage({ id: widget.props.schema.title })
                : undefined,
              enum: widget.props.schema.enum
                ? widget.props.schema.enum.map((name: string) => formatMessage({ id: name }))
                : undefined,
            },
          },
        },
      ],
    },
  };
}

// deep merge lodash | Check github "you don't need lodash"
