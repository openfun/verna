import _ from 'lodash';
import { VernaSchemaType } from ':/types/rjsf';
import { TranslationType } from ':/types/translations';
import { Maybe } from ':/types/utils';

/**
 * Merge new translation schema in existing schema.translationSchema
 * @param schema Original schema object
 * @param translations Object shaped like schema.translationSchema
 */
export function addTranslations(
  schema: VernaSchemaType,
  translations: Maybe<TranslationType>,
): VernaSchemaType {
  const translationSchema = _.cloneDeep(schema.translationSchema);

  return {
    ...schema,
    translationSchema: _.merge(translationSchema, translations),
  };
}

/**
 * Remove translations from schema.translationSchema
 * @param schema Original schema object
 * @param translations Object of locales with for each a list of keys to delete
 */
export function removeTranslations(
  schema: VernaSchemaType,
  translations: Maybe<string>[],
): VernaSchemaType {
  if (!schema.translationSchema) return schema;
  const newTranslationSchema = _.cloneDeep(schema.translationSchema);

  Object.keys(newTranslationSchema).forEach((locale: string) => {
    translations.forEach((key) => {
      if (key) delete newTranslationSchema?.[locale][key];
    });
  });

  return {
    ...schema,
    translationSchema: newTranslationSchema,
  };
}
