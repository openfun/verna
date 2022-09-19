import VernaJSONSchemaType from ':/types/rjsf';
import { Maybe } from ':/types/utils';
import { getSectionName } from ':/utils';

export function getSection(
  selector: Maybe<string>,
  schema: VernaJSONSchemaType,
  id: string,
): VernaJSONSchemaType {
  if (!schema) throw new Error("Error, getSection can't get the properties of the related section");
  if (selector) {
    return schema.properties![selector as keyof typeof schema.properties];
  }
  const sectionName = getSectionName(id);

  if (!sectionName) return schema;
  if (!schema.properties?.[sectionName])
    throw new Error("Error, getSection can't get the properties of the related section");
  return schema.properties?.[sectionName];
}
