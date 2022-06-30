import { PropsWithChildren } from 'react';

export default function WidgetWrapper({ children }: PropsWithChildren<{}>) {
  return <div className="form_toolbar_item">{children}</div>;
}
