import { Box } from 'grommet';
import { Drag } from 'grommet-icons';
import { PropsWithChildren } from 'react';

export default function WidgetWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <Box align="center" direction="row" gap="5px">
      <div className="form-toolbar-item">
        <Drag color="#7D4CDB77" size="medium" />
        {children}
      </div>
    </Box>
  );
}
