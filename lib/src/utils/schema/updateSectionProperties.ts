import { VernaContextProps } from ':/providers/VernaProvider';
import { RJSF_ID_SEPARATOR } from ':/settings';

export interface SectionParameters {
  title?: string;
  description?: string;
}

function updateProperty(
  propertyName: keyof SectionParameters,
  value: string | undefined,
  verna: VernaContextProps,
  locale: string,
  id: string,
) {
  const section =
    verna.selector || id === 'root'
      ? verna.schema
      : verna.schema.properties![
          id.split(RJSF_ID_SEPARATOR)[1] as keyof typeof verna.schema.properties
        ];
  const translationKey = [id, verna.selector, propertyName].join(RJSF_ID_SEPARATOR);

  const translations = { ...verna.schemaTranslations };
  if (!value) {
    if (translationKey in translations[locale]) {
      delete translations[locale][translationKey];
      section[propertyName] = '';
    }
  } else {
    section[propertyName] = translationKey;
    translations[locale][translationKey] = value;
  }
  verna.setSchemaTranslations(translations);
}

export function updateSectionProperties(
  formData: SectionParameters,
  verna: VernaContextProps,
  id: string,
  locale: string,
) {
  updateProperty('title', formData['title'], verna, locale, id);
  updateProperty('description', formData['description'], verna, locale, id);
  verna.setSchema({ ...verna.schema });
}
