import { VernaContextProps } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';
import VernaJSONSchemaType, { VernaSchemaType } from ':/types/rjsf';

export interface SectionParameters {
  title?: string;
  description?: string;
}

function setNewSectionPropertyValue(
  idParts: string[],
  property: keyof SectionParameters,
  value: string,
  schemaSection: VernaJSONSchemaType,
  newTranslations: Record<string, string>,
) {
  const propertyId = idParts.join(RJSF_ID_SEPARATOR);
  schemaSection[property] = propertyId;
  newTranslations[propertyId] = value;
}

export function updateSectionProperties(
  formData: SectionParameters,
  verna: VernaContextProps,
  id: string,
  locale: string,
) {
  const schemaUpdate: VernaSchemaType = { formSchema: {} };
  const newTranslations: Record<string, string> = {};

  if (id === 'root') {
    Object.keys(formData).forEach((property) => {
      setNewSectionPropertyValue(
        verna.selector ? [id, verna.selector, property] : [id, property],
        property as keyof SectionParameters,
        formData[property as keyof SectionParameters] || '',
        schemaUpdate.formSchema!,
        newTranslations,
      );
    });
  } else {
    const sectionName = id.split(RJSF_ID_SEPARATOR)[1];
    schemaUpdate.formSchema = { properties: { [sectionName]: {} } };
    Object.keys(formData).forEach((property) => {
      setNewSectionPropertyValue(
        [id, sectionName, property],
        property as keyof SectionParameters,
        formData[property as keyof SectionParameters] || '',
        schemaUpdate.formSchema!.properties![sectionName],
        newTranslations,
      );
    });
  }

  verna.updateVernaProperty(schemaUpdate);
  verna.addVernaTranslations({ [locale]: newTranslations });
}
