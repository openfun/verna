import { useVerna } from '@openfun/verna';
import { Box, Button, Meter, Text } from 'grommet';
import './SectionResume.scss';
import { FormattedMessage, useIntl } from 'react-intl';
import { statsData } from '../data/formdata';
import _ from 'lodash';

interface SectionResumeProperties {
  section: string;
}

export default function SectionResume({ section }: SectionResumeProperties) {
  const { schema, setSelector } = useVerna();
  const { formatMessage } = useIntl();
  const sectionData = statsData[section]?.[Object.keys(statsData[section])[0]] || {};
  const nbAnswers = _.reduce(sectionData, (total, current) => total + current) || 0;
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
        <br />
        <small>{`${nbAnswers} réponses`}</small>
      </p>
      <Box direction="column" gap="10px">
        {Object.keys(sectionData).map((dataName: string, index) => {
          const value = sectionData[formatMessage({ id: dataName })];
          const percentage = parseFloat(
            Number(nbAnswers ? (value / nbAnswers) * 100 : 0).toFixed(1),
          );
          return (
            <Box
              key={`${index}-${dataName}`}
              direction="row"
              style={{ alignItems: 'center', gap: '10px' }}
            >
              <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
                <div style={{ position: 'absolute' }}>
                  <Box
                    align="center"
                    direction="row"
                    style={{ marginTop: '8px', marginLeft: '20px' }}
                  >
                    <Text color="white" size="small" style={{ whiteSpace: 'nowrap' }} weight="bold">
                      {formatMessage({ id: dataName })}
                    </Text>
                  </Box>
                </div>
              </div>
              <Meter
                key={dataName}
                round
                background="rgba(125,76,219,0.31)"
                direction="horizontal"
                max={100}
                size="medium"
                thickness="medium"
                type="bar"
                values={[
                  {
                    value: percentage,
                    color: '#6a2ba6',
                    label: formatMessage({ id: dataName }),
                  },
                ]}
              />
              <Box align="center" direction="row" pad={{ bottom: 'xsmall' }}>
                <Text size="large" weight="bold">
                  {percentage}
                </Text>
                <Text size="small">%</Text>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Button
        primary
        label="Edit"
        onClick={() => setSelector(section)}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}
