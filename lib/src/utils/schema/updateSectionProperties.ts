import _ from 'lodash';
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
  translations: VernaContextProps['schemaTranslations'],
) {
  const section =
    verna.selector || id === 'root'
      ? verna.schema
      : verna.schema.properties![
          id.split(RJSF_ID_SEPARATOR)[1] as keyof typeof verna.schema.properties
        ];
  const translationKey = [id, verna.selector, propertyName].join(RJSF_ID_SEPARATOR);

  if (!value) {
    if (translationKey in translations[locale]) {
      delete translations[locale][translationKey];
      section[propertyName] = '';
    }
  } else {
    section[propertyName] = translationKey;
    translations[locale][translationKey] = value;
  }
}

export function updateSectionProperties(
  formData: SectionParameters,
  verna: VernaContextProps,
  id: string,
  locale: string,
) {
  const translations = _.cloneDeep(verna.schemaTranslations);
  if (!Object.keys(translations).includes(locale)) translations[locale] = {};

  updateProperty('title', formData['title'], verna, locale, id, translations);
  updateProperty('description', formData['description'], verna, locale, id, translations);
  verna.setSchema({ ...verna.schema });
  verna.setSchemaTranslations(translations);
}
