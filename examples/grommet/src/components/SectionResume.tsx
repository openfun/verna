import { useVerna } from '@openfun/verna';
import { Button, Meter } from 'grommet';
import './SectionResume.scss';
import { FormattedMessage } from 'react-intl';
import { formdata } from '../data/formdata';

interface SectionResumeProperties {
  section: string;
}

export default function SectionResume({ section }: SectionResumeProperties) {
  const { schema, setSelector } = useVerna();
  const sectionData = formdata[section];
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
      {/* Loop sur chaque fake data*/}
      <Meter
        round
        background="white"
        direction="horizontal"
        max={100}
        size="medium"
        thickness="medium"
        type="bar"
        values={[
          {
            value: 50,
            color: '#6a2ba6',
          },
        ]}
      />
      <Button primary label="Edit" onClick={() => setSelector(section)} />
    </div>
  );
}
