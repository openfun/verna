import { useVerna } from '@openfun/verna';
import { Box, Button, Meter } from 'grommet';
import './SectionResume.scss';
import { FormattedMessage, useIntl } from 'react-intl';
import { statsData } from '../data/formdata';

interface SectionResumeProperties {
  section: string;
}

export default function SectionResume({ section }: SectionResumeProperties) {
  const { schema, setSelector } = useVerna();
  const { formatMessage } = useIntl();
  const sectionProperties = schema.properties?.[section]?.properties;
  // Définir le modele de données et le save
  // Voir comment stocker les formData, si on prend que UN user ou tout les users etc..
  // Set fake data

  return (
    <div className="form_section-resume">
      <legend>
        {schema.properties?.[section].title && (
          <FormattedMessage id={schema.properties?.[section].title} />
        )}
      </legend>
      <p>
        {schema.properties?.[section].description && (
          <FormattedMessage id={schema.properties?.[section].description} />
        )}
      </p>
      <Box direction="column" gap="10px">
        {(sectionProperties?.[Object.keys(sectionProperties)[0]]?.enum || []).map(
          (dataName: string) => {
            return (
              <Meter
                key={dataName}
                round
                background="white"
                direction="horizontal"
                max={100}
                size="medium"
                thickness="medium"
                type="bar"
                values={[
                  {
                    value:
                      statsData[section][Object.keys(statsData[section])[0]][
                        formatMessage({ id: dataName })
                      ],
                    color: '#6a2ba6',
                    label: formatMessage({ id: dataName }),
                  },
                ]}
              />
            );
          },
        )}
      </Box>
      <Button primary label="Edit" onClick={() => setSelector(section)} />
    </div>
  );
}
