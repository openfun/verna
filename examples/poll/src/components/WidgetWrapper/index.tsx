import { Box } from 'grommet';
import { Drag } from 'grommet-icons';
import { SelectWidgetType } from ':/data/getLocalizedWidgetDefinitions';

export default function WidgetWrapper({ text }: SelectWidgetType) {
  return (
    <Box align="center" direction="row" gap="5px">
      <div className="form-toolbar-item">
        <Drag color="#7D4CDB77" size="medium" />
        {text}
      </div>
    </Box>
  );
}
