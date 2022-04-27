import { PropsWithChildren } from 'react';

export default function WidgetWrapper({ children }: PropsWithChildren<{}>) {
  return <div style={{ border: 'solid 1px gray', gap: '5px', padding: '5px' }}>{children}</div>;
}
